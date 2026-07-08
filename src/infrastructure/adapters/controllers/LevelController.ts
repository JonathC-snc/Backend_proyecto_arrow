import { Request, Response, NextFunction } from 'express';

export class LevelController {
  constructor(
    private readonly getLevelUseCase: any
  ) {}

  async getLevel(req: Request, res: Response, next: NextFunction) {
    try {
      const { levelId } = req.params;
      const result = await this.getLevelUseCase.execute({ levelId });
      return res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  }
}
