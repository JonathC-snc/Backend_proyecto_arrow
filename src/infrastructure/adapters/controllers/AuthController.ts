import { Request, Response, NextFunction } from 'express';
import { AuthRequestDto } from '../dtos/request/AuthRequestDto';

export class AuthController {
  constructor(
    private readonly registerUseCase: any,
    private readonly loginUseCase: any
  ) {}

  async register(req: Request, res: Response, next: NextFunction) {
    try {
      const dto: AuthRequestDto = req.body;
      const result = await this.registerUseCase.execute(dto);
      return res.status(201).json(result);
    } catch (error) {
      next(error);
    }
  }

  async login(req: Request, res: Response, next: NextFunction) {
    try {
      const dto: AuthRequestDto = req.body;
      const result = await this.loginUseCase.execute(dto);
      return res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  }
}
