# Registro de Uso de Inteligencia Artificial

## Herramientas Utilizadas
- **Gemini 3.1 Pro (High)**: Asistente principal para la planificación arquitectónica y diseño de dominio.
- **Búsqueda Web**: Utilizada para consultar mecánicas específicas, interfaz visual y sistemas de monetización del juego "Arrow Maze - Escape Puzzle" (SayGames Ltd.).

## Registro de Uso por Tarea

| Tarea | Resumen del Prompt | Resultado Esperado | Modificaciones Futuras |
| :--- | :--- | :--- | :--- |
| **Diseño Arquitectónico Base** | Diseñar Capa 1 y 2 para clon de "Arrow Maze" usando TypeScript y Clean Architecture, considerando economía (5 vidas, max 10 monedas/nivel) y mapas irregulares. | Estructura de carpetas detallada y definición de entidades, excepciones, interfaces y puertos que respeten los principios SOLID y encapsulamiento. | Expansión del sistema de monetización, integración de pasarelas de pago y adaptación de la regeneración de vidas basada en `cron` o marcas de tiempo (timestamp). |
| **Diseño Capa 3 Adaptadores** | Diseñar Capa 3 (Adaptadores de Interfaz) del backend usando Express y Supabase, respetando Clean Architecture y AOP para middlewares. | Plan de acción detallado incluyendo la documentación de IA y estructura de carpetas. | Generación de Controladores, DTOs, Middlewares (Auth, ErrorHandler) y Repositorios Concretos para integrarse en la Capa 4. |
| **Implementación de Lógica de Negocio Real e Integración con Supabase** | Reemplazar implementaciones simuladas (mocks) en Capa 2 y 3 conectando con Supabase. Hashing con bcrypt y emisión de JWT. | Eliminación de mocks, inyección de repositorios reales en Use Cases, e inyección de estos en controladores. | Afinar consultas complejas de Leaderboard y manejar regeneración de vidas asíncrona. |
| **Depuración y Corrección Arquitectónica** | Resolver problemas de desincronización de esquemas, fallos de inyección JWT, violaciones al SRP y Modelos de Dominio Anémicos en el sistema de sincronización de progreso. | Un sistema altamente robusto que respete los contratos de API y las reglas de Clean Architecture. | Escribir tests unitarios automatizados para las reglas de validación en la capa de Entidades. |

## Evaluación Crítica
La IA facilitó enormemente la abstracción de mecánicas de juego altamente visuales (como desenredar flechas y gestionar límites de tablero asimétricos) hacia un modelo de datos robusto e independiente del marco de trabajo (framework-agnostic). El uso del patrón de Excepciones de Dominio (AOP) garantiza un flujo de control limpio. Sin embargo, para la implementación completa, se requerirá un cuidadoso diseño del payload del nivel (`boardConfig`) dado que las matrices cuadradas tradicionales no soportan la escalabilidad del juego original de SayGames.

La planificación de la Capa 3 asegura una separación estricta donde la lógica de negocio permanece agnóstica a Express y Supabase. El uso de AOP para la captura global de errores y validación de tokens centraliza la lógica transversal, manteniendo los controladores enfocados únicamente en la orquestación HTTP.

### Evaluación: Implementación de Lógica de Negocio Real e Integración con Supabase
**Archivos Modificados:**
- `User.ts`: Inclusión de soporte para hash de contraseña.
- `RegisterUserUseCase.ts`, `LoginUseCase.ts`, `SyncProgressUseCase.ts`, `GetGlobalLeaderboardUseCase.ts`: Implementados para reemplazar mocks.
- `SupabaseUserRepository.ts`, `SupabaseProgressRepository.ts`, `SupabaseLeaderboardRepository.ts`: Actualizados con la lógica real interactuando con `@supabase/supabase-js`.
- `server.ts`: Sustitución de `mockUseCase` y `mockTokenService` por las instancias reales inyectando las dependencias necesarias.
- `JwtTokenService.ts`: Creado para implementar `ITokenService`.

**Principios de Clean Architecture:**
La inyección de los repositorios de Supabase (`Capa 3`) en los Casos de Uso (`Capa 2`) respeta los principios de Clean Architecture y la Inversión de Dependencias (Dependency Inversion Principle de SOLID). Los Casos de Uso dependen de abstracciones (`IUserRepository`, `IProgressRepository`), no de la implementación de Supabase. Esto permite que el día de mañana Supabase pueda ser reemplazado por MongoDB o cualquier otra base de datos, simplemente escribiendo un nuevo repositorio que implemente las mismas interfaces, sin tocar una sola línea de código de los Casos de Uso (la lógica de negocio pura).

**Evaluación Crítica sobre Manejo de Errores (AOP) en Consultas a BD:**
Delegar el manejo de errores al framework de excepciones de dominio mejora drásticamente la robustez del sistema. Al interactuar con Supabase, pueden surgir errores impredecibles (caída de red, timeout, violaciones de constraints). Sin embargo, al atrapar estos errores dentro de la Capa 3 (Repositorios) o dejar que burbujeen hacia el `ErrorHandlerMiddleware` (AOP), evitamos ensuciar la Capa 2 (Casos de Uso) con try-catch masivos dependientes de Supabase. El AOP actúa como un "paracaídas global" en la Capa 4, garantizando que un fallo en la base de datos no exponga trazas internas y siempre devuelva un formato JSON estándar de error (ej. HTTP 500 o 400).

### Evaluación: Depuración y Refactorización Arquitectónica
Durante las últimas sesiones de implementación, se llevaron a cabo intensas labores de depuración para asegurar la adherencia estricta a los principios de Clean Architecture y la integridad transaccional de los datos. Se resolvieron incidentes críticos clasificados en cuatro ejes principales:

**1. Sincronización de Esquema de Base de Datos:**
Se detectaron fallos críticos (`schema cache error`) derivados de suposiciones incorrectas en la Capa 3 (Repositorios). Inicialmente, se estaban inyectando campos inexistentes (como `current_level`) y asumiendo relaciones fantasma (`completed_levels(*)`). La solución requirió una revisión exhaustiva del repositorio `SupabaseProgressRepository` para alinear estrictamente la lectura (`.select('*')`) y escritura con el esquema real en PostgreSQL (`user_id`, `lives`, `coins`, `highest_level_completed`). Además, se corrigió el silenciamiento accidental de errores SQL, garantizando que excepciones subyacentes se propaguen adecuadamente a menos que sean legítimas (ej. `PGRST116`).

**2. Depuración del Flujo de Autenticación (JWT):**
Se resolvió una fuga de datos en el middleware de autenticación (`AuthMiddleware`) que resultaba en la pérdida del UUID del usuario durante las peticiones protegidas. La corrección involucró trazar el ciclo de vida del token desde su firma en `LoginUseCase` hasta su inyección en la solicitud HTTP (`req.user = payload`). Se implementó una extracción defensiva (`req.user?.id || req.user?.userId`) en los Controladores para brindar compatibilidad retroactiva con tokens emitidos previamente, garantizando que el `SyncProgressUseCase` reciba el identificador correcto.

**3. Aplicación del Principio de Responsabilidad Única (SRP):**
Una auditoría del `SyncProgressUseCase` reveló una violación letal al SRP: el caso de uso intentaba actualizar tanto el progreso del jugador como insertar datos en la tabla `leaderboard`, resultando en choques de restricciones `NOT NULL` (ej. `level_id` faltante). La refactorización arquitectónica consistió en purgar toda lógica de ranking de este archivo, limitándolo puramente al inventario del jugador. Posteriormente, se orquestó la creación de un caso de uso independiente (`SubmitScoreUseCase`) y un endpoint dedicado (`POST /api/leaderboard`), descentralizando las responsabilidades y estabilizando el sistema.

**4. Blindaje de Dominio (Anti-Trampas) y Modelos Ricos:**
Las pruebas de seguridad demostraron que el sistema sufría de un *Modelo de Dominio Anémico*, ya que permitía inyectar estados inválidos (ej. vidas infinitas o monedas negativas) directamente en la base de datos debido a que las actualizaciones se calculaban empíricamente en el Caso de Uso. Para mitigar esta vulnerabilidad, se impuso una política de *instanciación estricta*. Ahora, el DTO se mapea para instanciar la Entidad `PlayerProgress` *antes* de cualquier operación de guardado. Esto activa automáticamente las cláusulas de guarda (Guard Clauses) alojadas en la Capa 1, las cuales rechazan estados anómalos lanzando un `InvalidDomainDataException`. El interceptor global (AOP) captura esta excepción limpiamente, denegando transacciones maliciosas con un `400 Bad Request` inquebrantable. Adicionalmente, se ajustaron las llaves del DTO (`lives`, `coins`, `highest_level_completed`) para emparejarlas exactamente con el payload del frontend, eliminando errores por `undefined` en la validación estática de tipos.
