# Backend Proyecto Arrow

Este es el repositorio del proyecto backend "Arrow", desarrollado bajo los principios de **Clean Architecture** (Arquitectura Limpia) o Arquitectura Hexagonal (Ports & Adapters). El objetivo de esta estructura es mantener la lógica de negocio aislada de los detalles técnicos, infraestructuras y frameworks externos.

## 🏗️ Estructura del Proyecto

Actualmente, el proyecto se encuentra en sus instancias iniciales, habiendo definido las capas centrales (core) de la arquitectura:

```text
src/
├── application/       # Capa de Aplicación
│   ├── interfaces/    # Contratos generales que la aplicación debe cumplir
│   ├── ports/         # Puertos (Interfaces de entrada/salida para comunicación con el exterior)
│   └── use-cases/     # Casos de uso (Lógica de orquestación de la aplicación)
└── domain/            # Capa de Dominio (El corazón del negocio)
    ├── entities/      # Modelos de dominio y reglas de negocio puras
    └── exceptions/    # Excepciones personalizadas específicas del dominio
```

### Descripción de las Capas

#### 1. Domain (Dominio)
Es la capa más interna de la aplicación y no depende de ninguna otra capa. Contiene la lógica central del negocio.
- **`entities/`**: Contiene las entidades principales. Estos son objetos que poseen identidad y encapsulan el estado y las reglas más esenciales del negocio.
- **`exceptions/`**: Define errores específicos y controlados que pueden ocurrir dentro del contexto del dominio, asegurando que las reglas de negocio informen problemas de manera semántica.

#### 2. Application (Aplicación)
Esta capa orquesta el flujo de datos hacia y desde las entidades del dominio, y dirige a esas entidades para que usen sus reglas de negocio para lograr los objetivos de los casos de uso.
- **`use-cases/`**: Clases o funciones que representan las acciones específicas que un usuario u otro sistema puede realizar en la aplicación (por ejemplo, "Crear Usuario", "Procesar Pago").
- **`ports/`**: Define interfaces que las capas exteriores (como adaptadores de bases de datos o controladores web) deben implementar o consumir. Invierten la dependencia para que la lógica central no dependa de tecnologías externas.
- **`interfaces/`**: Contratos genéricos auxiliares para definir comportamientos requeridos dentro del flujo de la aplicación.

## 🚀 Siguientes Pasos
- Implementación de la capa de **Infrastructure** (Infraestructura) para los adaptadores (bases de datos, APIs externas, etc.).
- Configuración de dependencias y punto de entrada de la aplicación.
