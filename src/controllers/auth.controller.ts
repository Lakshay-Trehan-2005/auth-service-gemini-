import { Request, Response, NextFunction } from 'express';
import { User } from '../models/User';
import { Session } from '../models/Session';
import { CustomError } from '../utils/customError';
import { signAccessToken, signRefreshToken, verifyRefreshToken } from '../utils/jwt';

export const register = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { email, password, role } = req.body;
    
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      throw new CustomError(409, 'Email already in use');
    }

    const user = await User.create({ email, password, role });

    res.status(201).json({
      success: true,
      data: { id: user._id, email: user.email, role: user.role },
    });
  } catch (error) {
    next(error);
  }
};

export const login = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user || !(await (user as any).comparePassword(password))) {
      throw new CustomError(401, 'Invalid email or password');
    }

    const session = await Session.create({
      user: user._id,
      userAgent: req.headers['user-agent'] || '',
      ip: req.ip || req.socket.remoteAddress,
      refreshToken: 'temp', 
    });

    const accessToken = signAccessToken({ userId: user._id, sessionId: session._id, role: user.role });
    const refreshToken = signRefreshToken({ sessionId: session._id });

    session.refreshToken = refreshToken;
    await session.save();

    res.status(200).json({
      success: true,
      data: { accessToken, refreshToken },
    });
  } catch (error) {
    next(error);
  }
};

export const refresh = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { refreshToken } = req.body;

    const decoded: any = verifyRefreshToken(refreshToken);
    if (!decoded) {
      throw new CustomError(401, 'Invalid or expired refresh token');
    }

    const session = await Session.findById(decoded.sessionId);
    if (!session || !session.isValid || session.refreshToken !== refreshToken) {
      throw new CustomError(401, 'Invalid session');
    }

    const user = await User.findById(session.user);
    if (!user) {
      throw new CustomError(401, 'User not found');
    }

    const newAccessToken = signAccessToken({ userId: user._id, sessionId: session._id, role: user.role });
    
    res.status(200).json({
      success: true,
      data: { accessToken: newAccessToken },
    });
  } catch (error) {
    next(error);
  }
};

export const logout = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const sessionId = req.session.id;
    await Session.findByIdAndUpdate(sessionId, { isValid: false });
    
    res.status(200).json({ success: true, message: 'Logged out successfully' });
  } catch (error) {
    next(error);
  }
};

export const logoutAll = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = req.user._id;
    await Session.updateMany({ user: userId }, { isValid: false });
    
    res.status(200).json({ success: true, message: 'Logged out from all devices' });
  } catch (error) {
    next(error);
  }
};

export const changePassword = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { oldPassword, newPassword } = req.body;
    const user = await User.findById(req.user._id);

    if (!user || !(await (user as any).comparePassword(oldPassword))) {
      throw new CustomError(400, 'Invalid old password');
    }

    user.password = newPassword;
    await user.save();

    // Invalidate all existing sessions
    await Session.updateMany({ user: user._id }, { isValid: false });

    res.status(200).json({ success: true, message: 'Password changed successfully, all sessions invalidated' });
  } catch (error) {
    next(error);
  }
};
