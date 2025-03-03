import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import User, { UserRole } from '../models/User';
import Club, { ClubMemberRole } from '../models/Club';
import { logger } from '../utils/logger';
import jwt from 'jsonwebtoken';

// 모든 사용자 조회
export const getUsers = async (req: Request, res: Response) => {
  try {
    const users = await User.find().select('-password');
    res.status(StatusCodes.OK).json({ users });
  } catch (error) {
    logger.error('사용자 조회 오류:', error);
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ message: '사용자 조회 중 오류가 발생했습니다.' });
  }
};

// 특정 사용자 조회
export const getUserById = async (req: Request, res: Response) => {
  try {
    const user = await User.findById(req.params.id).select('-password');
    if (!user) {
      res
        .status(StatusCodes.NOT_FOUND)
        .json({ message: '사용자를 찾을 수 없습니다.' });
      return;
    }
    res.status(StatusCodes.OK).json({ user });
  } catch (error) {
    logger.error('사용자 조회 오류:', error);
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ message: '사용자 조회 중 오류가 발생했습니다.' });
  }
};

// 사용자 생성
export const createUser = async (req: Request, res: Response) => {
  try {
    const { username, email, password, firstName, lastName, role } =
      req.body;

    // 이메일 중복 확인
    const existingUser = await User.findOne({
      $or: [{ email }, { username }],
    });
    if (existingUser) {
      res.status(StatusCodes.BAD_REQUEST).json({
        message: '이미 사용 중인 이메일 또는 사용자 이름입니다.',
      });
      return;
    }

    // 관리자 역할 검증 (필요한 경우)
    const userRole =
      role === UserRole.ADMIN ? UserRole.ADMIN : UserRole.USER;

    const user = await User.create({
      username,
      email,
      password,
      firstName,
      lastName,
      role: userRole,
    });

    // JWT 토큰 생성
    const token = jwt.sign(
      { userId: user._id, role: user.role },
      process.env.JWT_SECRET || 'your-secret-key',
      { expiresIn: '1d' }
    );

    // 비밀번호 제외하고 응답
    const userResponse = {
      _id: user._id,
      username: user.username,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      role: user.role,
    };

    res.status(StatusCodes.CREATED).json({
      token,
      user: userResponse,
    });
  } catch (error) {
    logger.error('사용자 생성 오류:', error);
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ message: '사용자 생성 중 오류가 발생했습니다.' });
  }
};

// 사용자 로그인
export const loginUser = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    // 사용자 찾기
    const user = await User.findOne({ email });
    if (!user) {
      res
        .status(StatusCodes.UNAUTHORIZED)
        .json({ message: '이메일 또는 비밀번호가 올바르지 않습니다.' });
      return;
    }

    // 비밀번호 확인
    const isPasswordValid = await user.comparePassword(password);
    if (!isPasswordValid) {
      res
        .status(StatusCodes.UNAUTHORIZED)
        .json({ message: '이메일 또는 비밀번호가 올바르지 않습니다.' });
      return;
    }

    // 마지막 로그인 시간 업데이트
    user.lastLogin = new Date();
    await user.save();

    // JWT 토큰 생성
    const token = jwt.sign(
      { userId: user._id, role: user.role },
      process.env.JWT_SECRET || 'your-secret-key',
      { expiresIn: '1d' }
    );

    res.status(StatusCodes.OK).json({
      token,
      user: {
        _id: user._id,
        username: user.username,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    logger.error('로그인 오류:', error);
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ message: '로그인 중 오류가 발생했습니다.' });
  }
};

// 사용자 정보 업데이트
export const updateUser = async (req: Request, res: Response) => {
  try {
    const { firstName, lastName, profileImage } = req.body;
    const userId = req.params.id;

    const user = await User.findById(userId);
    if (!user) {
      res
        .status(StatusCodes.NOT_FOUND)
        .json({ message: '사용자를 찾을 수 없습니다.' });
      return;
    }

    // 업데이트할 필드만 변경
    if (firstName) user.firstName = firstName;
    if (lastName) user.lastName = lastName;
    if (profileImage) user.profileImage = profileImage;

    await user.save();

    res.status(StatusCodes.OK).json({
      user: {
        _id: user._id,
        username: user.username,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        profileImage: user.profileImage,
        role: user.role,
      },
    });
  } catch (error) {
    logger.error('사용자 업데이트 오류:', error);
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ message: '사용자 업데이트 중 오류가 발생했습니다.' });
  }
};

// 사용자 삭제 (관리자 전용)
export const deleteUser = async (req: Request, res: Response) => {
  try {
    const userId = req.params.id;

    const user = await User.findById(userId);
    if (!user) {
      res
        .status(StatusCodes.NOT_FOUND)
        .json({ message: '사용자를 찾을 수 없습니다.' });
      return;
    }

    await User.findByIdAndDelete(userId);

    res
      .status(StatusCodes.OK)
      .json({ message: '사용자가 삭제되었습니다.' });
  } catch (error) {
    logger.error('사용자 삭제 오류:', error);
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ message: '사용자 삭제 중 오류가 발생했습니다.' });
  }
};

// 현재 로그인한 사용자의 프로필 조회
export const getUserProfile = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.userId;

    const user = await User.findById(userId).select('-password');
    if (!user) {
      res
        .status(StatusCodes.NOT_FOUND)
        .json({ message: '사용자를 찾을 수 없습니다.' });
      return;
    }

    res.status(StatusCodes.OK).json({ user });
  } catch (error) {
    logger.error('프로필 조회 오류:', error);
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ message: '프로필 조회 중 오류가 발생했습니다.' });
  }
};

// 현재 로그인한 사용자의 프로필 업데이트
export const updateUserProfile = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.userId;
    const { firstName, lastName, profileImage } = req.body;

    const user = await User.findById(userId);
    if (!user) {
      res
        .status(StatusCodes.NOT_FOUND)
        .json({ message: '사용자를 찾을 수 없습니다.' });
      return;
    }

    // 업데이트할 필드만 변경
    if (firstName) user.firstName = firstName;
    if (lastName) user.lastName = lastName;
    if (profileImage) user.profileImage = profileImage;

    await user.save();

    res.status(StatusCodes.OK).json({
      user: {
        _id: user._id,
        username: user.username,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        profileImage: user.profileImage,
        role: user.role,
      },
    });
  } catch (error) {
    logger.error('프로필 업데이트 오류:', error);
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ message: '프로필 업데이트 중 오류가 발생했습니다.' });
  }
};

// 비밀번호 변경
export const changePassword = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.userId;
    const { currentPassword, newPassword } = req.body;

    const user = await User.findById(userId);
    if (!user) {
      res
        .status(StatusCodes.NOT_FOUND)
        .json({ message: '사용자를 찾을 수 없습니다.' });
      return;
    }

    // 현재 비밀번호 확인
    const isPasswordValid = await user.comparePassword(currentPassword);
    if (!isPasswordValid) {
      res
        .status(StatusCodes.BAD_REQUEST)
        .json({ message: '현재 비밀번호가 일치하지 않습니다.' });
      return;
    }

    // 새 비밀번호 설정
    user.password = newPassword;
    await user.save();

    res
      .status(StatusCodes.OK)
      .json({ message: '비밀번호가 변경되었습니다.' });
  } catch (error) {
    logger.error('비밀번호 변경 오류:', error);
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ message: '비밀번호 변경 중 오류가 발생했습니다.' });
  }
};

// 사용자가 속한 동아리 목록 조회
export const getUserClubs = async (req: Request, res: Response) => {
  try {
    const userId = req.params.id || req.user?.userId;
    const { role } = req.query;

    // 기본 쿼리: 사용자가 멤버인 동아리 검색
    const query: any = {
      $or: [
        { 'members.user': userId },
        { owner: userId }, // 소유한 동아리도 포함
      ],
      isActive: true,
    };

    // 특정 역할로 필터링하는 경우
    if (role) {
      query['members.role'] = role;
    }

    const clubs = await Club.find(query)
      .populate('owner', 'username email profileImage')
      .sort({ createdAt: -1 });

    res.status(StatusCodes.OK).json({ clubs });
  } catch (error) {
    logger.error('사용자 동아리 조회 오류:', error);
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ message: '사용자 동아리 조회 중 오류가 발생했습니다.' });
  }
};

// 사용자가 소유한 동아리 목록 조회 (소유자인 동아리만)
export const getUserOwnedClubs = async (req: Request, res: Response) => {
  try {
    const userId = req.params.id || req.user?.userId;

    const clubs = await Club.find({
      owner: userId,
      isActive: true,
    })
      .populate('owner', 'username email profileImage')
      .sort({ createdAt: -1 });

    res.status(StatusCodes.OK).json({ clubs });
  } catch (error) {
    logger.error('사용자 소유 동아리 조회 오류:', error);
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ message: '사용자 소유 동아리 조회 중 오류가 발생했습니다.' });
  }
};
