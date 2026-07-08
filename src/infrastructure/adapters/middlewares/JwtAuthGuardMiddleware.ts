import { Request, Response, NextFunction } from 'express';
import { ITokenService } from '../../../application/ports/services/ITokenService';

export interface AuthenticatedRequest extends Request {
  user?: any;
}

export const JwtAuthGuard = (tokenService: ITokenService) => {
  return (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ error: 'Unauthorized', message: 'No token provided' });
    }

    const token = authHeader.split(' ')[1];
    try {
      const payload = tokenService.verifyToken(token);
      req.user = payload;
      next();
    } catch (error) {
      return res.status(401).json({ error: 'Unauthorized', message: 'Invalid or expired token' });
    }
  };
};
