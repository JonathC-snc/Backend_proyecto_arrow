import { Request, Response, NextFunction } from 'express';

import { AuthenticatedRequest } from '../middlewares/JwtAuthGuardMiddleware';

export class LeaderboardController {
  constructor(
    private readonly getGlobalLeaderboardUseCase: any,
    private readonly submitScoreUseCase: any
  ) {}
  async submitScore(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const { level_id, score } = req.body;
      const extractedId = req.user?.id || req.user?.userId;
      
      const result = await this.submitScoreUseCase.execute({
        userId: extractedId,
        username: req.user?.username,
        levelId: level_id,
        score
      });
      return res.status(201).json(result);
    } catch (error) {
      next(error);
    }
  }

  async getLeaderboard(req: Request, res: Response, next: NextFunction) {
    try {
      const { levelId } = req.params;
      const result = await this.getGlobalLeaderboardUseCase.execute({ levelId });
      return res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  }
}
