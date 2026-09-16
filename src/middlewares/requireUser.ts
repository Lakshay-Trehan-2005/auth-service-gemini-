import { Request, Response, NextFunction } from 'express';
import { verifyAccessToken } from '../utils/jwt';
import { CustomError } from '../utils/customError';
import { User } from '../models/User';

declare global {
  namespace Express {
    interface Request {
      user?: any;
      session?: any;
    }
  }
}

export const requireUser = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw new CustomError(401, 'Authentication required');
    }

    const token = authHeader.split(' ')[1];
    const decoded: any = verifyAccessToken(token);

    if (!decoded) {
      throw new CustomError(401, 'Invalid or expired access token');
    }

    const user = await User.findById(decoded.userId).select('-password');
    if (!user) {
      throw new CustomError(401, 'User not found');
    }

    req.user = user;
    req.session = { id: decoded.sessionId };
    next();
  } catch (error) {
    next(error);
  }
};
