import { Request, Response, NextFunction } from 'express';
import { CustomError } from '../utils/customError';

export const requireRole = (roles: string[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.user || !roles.includes(req.user.role)) {
      return next(new CustomError(403, 'Forbidden: Insufficient permissions'));
    }
    next();
  };
};
