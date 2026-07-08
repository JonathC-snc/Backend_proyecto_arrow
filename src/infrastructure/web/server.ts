import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { supabaseClient } from '../config/supabaseClient';
import { setupRoutes } from './routes';
import { ErrorHandlerMiddleware } from '../adapters/middlewares/ErrorHandlerMiddleware';

// Repositorios
import { SupabaseUserRepository } from '../adapters/repositories/supabase/SupabaseUserRepository';
import { SupabaseProgressRepository } from '../adapters/repositories/supabase/SupabaseProgressRepository';
import { SupabaseLeaderboardRepository } from '../adapters/repositories/supabase/SupabaseLeaderboardRepository';

// Controladores
import { AuthController } from '../adapters/controllers/AuthController';
import { ProgressController } from '../adapters/controllers/ProgressController';
import { LeaderboardController } from '../adapters/controllers/LeaderboardController';
import { LevelController } from '../adapters/controllers/LevelController';

// Cargar variables de entorno
dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

// --- Configuración de Middlewares Base ---
app.use(cors());
app.use(express.json());

// --- Dependencias Reales (Sustitución de Mocks) ---
import { RegisterUserUseCase } from '../../application/use-cases/RegisterUserUseCase';
import { LoginUseCase } from '../../application/use-cases/LoginUseCase';
import { SyncProgressUseCase } from '../../application/use-cases/SyncProgressUseCase';
import { GetGlobalLeaderboardUseCase } from '../../application/use-cases/GetGlobalLeaderboardUseCase';
import { SubmitScoreUseCase } from '../../application/use-cases/SubmitScoreUseCase';
import { JwtTokenService } from '../adapters/services/JwtTokenService';

// Repositorio Mock temporal para ILevelRepository ya que no existe un SupabaseLevelRepository en el prompt
const mockLevelRepository = {
  findById: async (id: number) => ({ id, name: "Level", targetScore: 100 })
};

// --- Inyección de Dependencias (App Context) ---
/**
 * Clean Architecture: Instanciamos los repositorios (Capa 3) inyectándoles el cliente de base de datos (Capa 4).
 * La base de datos se inyecta desde fuera, manteniendo el dominio intacto.
 * Luego estos repositorios se inyectan en los Casos de Uso (Capa 2), los cuales finalmente
 * se inyectan en los Controladores (Capa 3).
 */
const userRepository = new SupabaseUserRepository(supabaseClient);
const progressRepository = new SupabaseProgressRepository(supabaseClient);
const leaderboardRepository = new SupabaseLeaderboardRepository(supabaseClient);

// Servicios
const tokenService = new JwtTokenService();

// Casos de uso reales
const registerUserUseCase = new RegisterUserUseCase(userRepository, progressRepository);
const loginUseCase = new LoginUseCase(userRepository, tokenService);
const syncProgressUseCase = new SyncProgressUseCase(progressRepository, mockLevelRepository as any);
const getGlobalLeaderboardUseCase = new GetGlobalLeaderboardUseCase(leaderboardRepository);
const submitScoreUseCase = new SubmitScoreUseCase(leaderboardRepository);

// Mocks temporales para casos de uso que no estaban en los requerimientos actuales
const mockUseCase = { execute: async (dto: any) => ({ success: true, message: "Mocked Use Case Executed" }) };

// Instanciamos los controladores inyectando los casos de uso
const authController = new AuthController(registerUserUseCase, loginUseCase);
const progressController = new ProgressController(syncProgressUseCase, mockUseCase);
const leaderboardController = new LeaderboardController(getGlobalLeaderboardUseCase, submitScoreUseCase);
const levelController = new LevelController(mockUseCase);

// --- Montar Rutas ---
const apiRouter = setupRoutes(
  authController,
  progressController,
  leaderboardController,
  levelController,
  tokenService
);

app.use('/api', apiRouter);

// --- Middleware de AOP (Captura de Errores) ---
// Debe ir al final de la cadena de express para interceptar todas las excepciones pasadas por next()
app.use(ErrorHandlerMiddleware);

// --- Levantar Servidor ---
app.listen(port, () => {
  console.log(`[Server]: Arrow Maze Backend corriendo en http://localhost:${port}`);
  console.log(`[Clean Architecture]: Capa 4 (Frameworks y Drivers) inicializada correctamente.`);
});
