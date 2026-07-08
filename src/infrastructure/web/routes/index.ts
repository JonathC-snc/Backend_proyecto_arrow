import { Router } from 'express';
import { AuthController } from '../../adapters/controllers/AuthController';
import { ProgressController } from '../../adapters/controllers/ProgressController';
import { LeaderboardController } from '../../adapters/controllers/LeaderboardController';
import { LevelController } from '../../adapters/controllers/LevelController';
import { JwtAuthGuard } from '../../adapters/middlewares/JwtAuthGuardMiddleware';
import { ITokenService } from '../../../application/ports/services/ITokenService';

export const setupRoutes = (
  authController: AuthController,
  progressController: ProgressController,
  leaderboardController: LeaderboardController,
  levelController: LevelController,
  tokenService: ITokenService
): Router => {
  const router = Router();
  
  // Instanciamos el middleware de autenticación inyectando el servicio de token
  const authMiddleware = JwtAuthGuard(tokenService);

  // --- Rutas de Autenticación ---
  router.post('/auth/register', (req, res, next) => authController.register(req, res, next));
  router.post('/auth/login', (req, res, next) => authController.login(req, res, next));

  // --- Rutas de Progreso (Protegidas) ---
  router.post('/progress/sync', authMiddleware, (req, res, next) => progressController.syncProgress(req as any, res, next));
  router.get('/progress', authMiddleware, (req, res, next) => progressController.getProgress(req as any, res, next));

  // --- Rutas de Leaderboard ---
  router.get('/leaderboard/:levelId', (req, res, next) => leaderboardController.getLeaderboard(req, res, next));
  router.post('/leaderboard', authMiddleware, (req, res, next) => leaderboardController.submitScore(req as any, res, next));

  // --- Rutas de Niveles ---
  router.get('/level/:levelId', (req, res, next) => levelController.getLevel(req, res, next));

  return router;
};
