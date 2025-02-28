import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { StatusCodes } from 'http-status-codes';
import { UserRole } from '../models/User';

// JWT 페이로드 타입 정의
interface JwtPayload {
  userId: string;
  role: UserRole;
}

// Request 타입 확장
declare global {
  namespace Express {
    interface Request {
      user?: JwtPayload;
    }
  }
}

// 인증 미들웨어
export const authenticate = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      res
        .status(StatusCodes.UNAUTHORIZED)
        .json({ message: '인증이 필요합니다.' });
      return;
    }

    const token = authHeader.split(' ')[1];
    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET || 'your-secret-key'
    ) as JwtPayload;

    req.user = decoded;
    next();
  } catch (error) {
    res
      .status(StatusCodes.UNAUTHORIZED)
      .json({ message: '유효하지 않은 토큰입니다.' });
    return;
  }
};

// 관리자 권한 확인 미들웨어
export const isAdmin = (req: Request, res: Response, next: NextFunction) => {
  if (!req.user || req.user.role !== UserRole.ADMIN) {
    res
      .status(StatusCodes.FORBIDDEN)
      .json({ message: '관리자 권한이 필요합니다.' });
    return;
  }
  next();
};
