import { Request, Response, NextFunction } from 'express';
import { DomainException } from '../../../domain/exceptions/DomainException';
import { InvalidDomainDataException } from '../../../domain/exceptions/InvalidDomainDataException';

export const ErrorHandlerMiddleware = (err: Error, req: Request, res: Response, next: NextFunction) => {
  if (err instanceof InvalidDomainDataException) {
    return res.status(400).json({ error: err.name, message: err.message });
  }
  
  if (err instanceof DomainException) {
    // Specific domain exceptions mapping
    if (err.name === 'InsufficientLivesException') {
      return res.status(400).json({ error: err.name, message: err.message });
    }
    return res.status(400).json({ error: err.name, message: err.message });
  }

  // Generic 404 handler for not found entities
  if (err.message && err.message.toLowerCase().includes('not found')) {
    return res.status(404).json({ error: 'NotFound', message: err.message });
  }

  // Fallback to 500
  console.error('[Global Error Handler]', err);
  return res.status(500).json({ error: 'InternalServerError', message: 'An unexpected error occurred' });
};
