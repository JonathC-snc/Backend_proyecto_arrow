import { Response, NextFunction } from 'express';
import { SyncProgressRequestDto } from '../dtos/request/SyncProgressRequestDto';
import { AuthenticatedRequest } from '../middlewares/JwtAuthGuardMiddleware';

export class ProgressController {
  constructor(
    private readonly syncProgressUseCase: any,
    private readonly getProgressUseCase: any
  ) {}

  async syncProgress(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const dto: SyncProgressRequestDto = req.body;
      const extractedId = req.user?.id || req.user?.userId;
      
      console.log("ID extraído del token en /sync:", extractedId);
      console.log("Token Payload completo:", req.user);

      dto.userId = extractedId;
      dto.username = req.user?.username;
      
      const result = await this.syncProgressUseCase.execute(dto);
      return res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  }

  async getProgress(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const extractedId = req.user?.id || req.user?.userId;
      console.log("ID extraído del token en /getProgress:", extractedId);

      const result = await this.getProgressUseCase.execute({ userId: extractedId });
      return res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  }
}
