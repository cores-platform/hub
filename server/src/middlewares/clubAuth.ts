import { Request, Response, NextFunction } from 'express';
import { StatusCodes } from 'http-status-codes';
import Club, { ClubMemberRole, IClub } from '../models/Club';

// 파일 상단에 인터페이스 정의
interface RequestWithClub extends Request {
  club?: IClub;
}

// 동아리 소유자 확인
export const isClubOwner = async (
  req: RequestWithClub,
  res: Response,
  next: NextFunction
) => {
  try {
    const clubId = req.params.id;
    const userId = req.user?.userId;

    const club = await Club.findById(clubId);

    if (!club) {
      res
        .status(StatusCodes.NOT_FOUND)
        .json({ message: '동아리를 찾을 수 없습니다.' });
      return;
    }

    if (club.owner.toString() !== userId) {
      res
        .status(StatusCodes.FORBIDDEN)
        .json({ message: '동아리 소유자만 이 작업을 수행할 수 있습니다.' });
      return;
    }

    req.club = club;
    next();
  } catch (error) {
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ message: '권한 확인 중 오류가 발생했습니다.' });
  }
};

// 동아리 관리자 확인 (소유자 또는 관리자)
export const isClubAdmin = async (
  req: RequestWithClub,
  res: Response,
  next: NextFunction
) => {
  try {
    const clubId = req.params.id;
    const userId = req.user?.userId;

    const club = await Club.findById(clubId);

    if (!club) {
      res
        .status(StatusCodes.NOT_FOUND)
        .json({ message: '동아리를 찾을 수 없습니다.' });
      return;
    }

    // 소유자인 경우
    if (club.owner.toString() === userId) {
      req.club = club;
      next();
      return;
    }

    // 관리자인 경우
    const memberInfo = club.members.find(
      (member) =>
        member.user.toString() === userId &&
        member.role === ClubMemberRole.ADMIN
    );

    if (!memberInfo) {
      res
        .status(StatusCodes.FORBIDDEN)
        .json({ message: '동아리 관리자만 이 작업을 수행할 수 있습니다.' });
      return;
    }

    req.club = club;
    next();
  } catch (error) {
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ message: '권한 확인 중 오류가 발생했습니다.' });
  }
};

// 동아리 회원 확인
export const isClubMember = async (
  req: RequestWithClub,
  res: Response,
  next: NextFunction
) => {
  try {
    const clubId = req.params.id;
    const userId = req.user?.userId;

    const club = await Club.findById(clubId);

    if (!club) {
      res
        .status(StatusCodes.NOT_FOUND)
        .json({ message: '동아리를 찾을 수 없습니다.' });
      return;
    }

    // 소유자인 경우
    if (club.owner.toString() === userId) {
      req.club = club;
      next();
      return;
    }

    // 회원인 경우 (관리자 포함)
    const memberInfo = club.members.find(
      (member) =>
        member.user.toString() === userId &&
        (member.role === ClubMemberRole.MEMBER ||
          member.role === ClubMemberRole.ADMIN)
    );

    if (!memberInfo) {
      res
        .status(StatusCodes.FORBIDDEN)
        .json({ message: '동아리 회원만 이 작업을 수행할 수 있습니다.' });
      return;
    }

    req.club = club;
    next();
  } catch (error) {
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ message: '권한 확인 중 오류가 발생했습니다.' });
  }
};
