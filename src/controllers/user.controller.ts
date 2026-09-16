import { Request, Response, NextFunction } from 'express';
import { User } from '../models/User';
import { Session } from '../models/Session';

export const getSessions = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const sessions = await Session.find({ user: req.user._id, isValid: true }).select('-refreshToken');
    res.status(200).json({ success: true, data: sessions });
  } catch (error) {
    next(error);
  }
};

export const revokeSession = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { sessionId } = req.params;
    await Session.findOneAndUpdate({ _id: sessionId, user: req.user._id }, { isValid: false });
    res.status(200).json({ success: true, message: 'Session revoked' });
  } catch (error) {
    next(error);
  }
};

export const getAllUsersAdmin = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const users = await User.find().select('-password');
    res.status(200).json({ success: true, data: users });
  } catch (error) {
    next(error);
  }
};
