import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import Club, { ClubMemberRole, IClubMember, IClub } from '../models/Club';
import User from '../models/User';
import { logger } from '../utils/logger';

// 파일 상단에 인터페이스 정의
interface RequestWithClub extends Request {
  club?: IClub;
}

// 동아리 정보 업데이트 (소유자)
export const updateClub = async (req: RequestWithClub, res: Response) => {
  try {
    const { name, description, category, imageUrl, isPrivate } = req.body;
    const clubId = req.params.id;

    // 타입 캐스팅
    const typedReq = req as RequestWithClub;
    const club = typedReq.club!;

    // 이름 변경 시 중복 확인
    if (name && name !== club.name) {
      const existingClub = await Club.findOne({ name });
      if (existingClub) {
        res
          .status(StatusCodes.BAD_REQUEST)
          .json({ message: '이미 존재하는 동아리 이름입니다.' });
        return;
      }
      club.name = name;
    }

    // 업데이트할 필드만 변경
    if (description) club.description = description;
    if (category) club.category = category;
    if (imageUrl) club.imageUrl = imageUrl;
    if (isPrivate !== undefined) club.isPrivate = isPrivate;

    await club.save();

    res.status(StatusCodes.OK).json({ club });
  } catch (error) {
    logger.error('동아리 업데이트 오류:', error);
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ message: '동아리 업데이트 중 오류가 발생했습니다.' });
  }
};

// 동아리 소유권 이전 (소유자)
export const transferOwnership = async (
  req: RequestWithClub,
  res: Response
) => {
  try {
    const { userId } = req.body;
    const clubId = req.params.id;
    const club = req.club!; // isClubOwner 미들웨어에서 설정됨

    // 새 소유자가 회원인지 확인
    const memberIndex = club.members.findIndex(
      (member) => member.user.toString() === userId
    );

    if (memberIndex === -1) {
      res
        .status(StatusCodes.BAD_REQUEST)
        .json({ message: '소유권을 이전할 대상이 동아리 회원이 아닙니다.' });
      return;
    }

    // 소유권 이전
    const oldOwner = club.owner;
    club.owner = userId as any;

    // 이전 소유자를 관리자로 추가
    club.members.push({
      user: oldOwner,
      role: ClubMemberRole.ADMIN,
      joinedAt: new Date(),
    });

    // 새 소유자를 회원 목록에서 제거
    club.members.splice(memberIndex, 1);

    await club.save();

    res.status(StatusCodes.OK).json({
      message: '동아리 소유권이 이전되었습니다.',
      club,
    });
  } catch (error) {
    logger.error('동아리 소유권 이전 오류:', error);
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ message: '동아리 소유권 이전 중 오류가 발생했습니다.' });
  }
};

// 동아리 삭제 (소유자)
export const deleteClub = async (req: RequestWithClub, res: Response) => {
  try {
    const clubId = req.params.id;
    await Club.findByIdAndDelete(clubId);

    res.status(StatusCodes.OK).json({ message: '동아리가 삭제되었습니다.' });
  } catch (error) {
    logger.error('동아리 삭제 오류:', error);
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ message: '동아리 삭제 중 오류가 발생했습니다.' });
  }
};

// 회원 가입 승인 (소유자/관리자)
export const approveJoinRequest = async (
  req: RequestWithClub,
  res: Response
) => {
  try {
    const { userId } = req.body;
    const clubId = req.params.id;
    const club = req.club!; // isClubAdmin 미들웨어에서 설정됨

    // 가입 신청한 사용자인지 확인
    const memberIndex = club.members.findIndex(
      (member) =>
        member.user.toString() === userId &&
        member.role === ClubMemberRole.PENDING
    );

    if (memberIndex === -1) {
      res
        .status(StatusCodes.BAD_REQUEST)
        .json({ message: '해당 사용자의 가입 신청이 없습니다.' });
      return;
    }

    // 회원으로 승인
    club.members[memberIndex].role = ClubMemberRole.MEMBER;
    await club.save();

    res.status(StatusCodes.OK).json({
      message: '가입 신청이 승인되었습니다.',
      member: club.members[memberIndex],
    });
  } catch (error) {
    logger.error('가입 승인 오류:', error);
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ message: '가입 승인 중 오류가 발생했습니다.' });
  }
};

// 회원 가입 거부 (소유자/관리자)
export const rejectJoinRequest = async (
  req: RequestWithClub,
  res: Response
) => {
  try {
    const { userId } = req.body;
    const clubId = req.params.id;
    const club = req.club!; // isClubAdmin 미들웨어에서 설정됨

    // 가입 신청한 사용자인지 확인
    const memberIndex = club.members.findIndex(
      (member) =>
        member.user.toString() === userId &&
        member.role === ClubMemberRole.PENDING
    );

    if (memberIndex === -1) {
      res
        .status(StatusCodes.BAD_REQUEST)
        .json({ message: '해당 사용자의 가입 신청이 없습니다.' });
      return;
    }

    // 회원 목록에서 제거
    club.members.splice(memberIndex, 1);
    await club.save();

    res.status(StatusCodes.OK).json({
      message: '가입 신청이 거부되었습니다.',
    });
  } catch (error) {
    logger.error('가입 거부 오류:', error);
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ message: '가입 거부 중 오류가 발생했습니다.' });
  }
};

// 회원 추방 (소유자/관리자)
export const kickMember = async (req: RequestWithClub, res: Response) => {
  try {
    const { userId } = req.body;
    const clubId = req.params.id;
    const club = req.club!; // isClubAdmin 미들웨어에서 설정됨

    // 소유자는 추방할 수 없음
    if (club.owner.toString() === userId) {
      res
        .status(StatusCodes.BAD_REQUEST)
        .json({ message: '동아리 소유자는 추방할 수 없습니다.' });
      return;
    }

    // 관리자가 다른 관리자를 추방하는지 확인 (소유자만 관리자를 추방 가능)
    const memberToKick = club.members.find(
      (member: IClubMember) => member.user.toString() === userId
    );

    if (!memberToKick) {
      res
        .status(StatusCodes.BAD_REQUEST)
        .json({ message: '해당 사용자는 동아리 회원이 아닙니다.' });
      return;
    }

    // 일반 관리자가 다른 관리자를 추방하려는 경우 (소유자는 isClubOwner 미들웨어로 구분)
    if (
      memberToKick.role === ClubMemberRole.ADMIN &&
      req.user?.userId !== club.owner.toString()
    ) {
      res
        .status(StatusCodes.FORBIDDEN)
        .json({ message: '관리자는 다른 관리자를 추방할 수 없습니다.' });
      return;
    }

    // 회원 목록에서 제거
    const memberIndex = club.members.findIndex(
      (member: IClubMember) => member.user.toString() === userId
    );
    club.members.splice(memberIndex, 1);
    await club.save();

    res.status(StatusCodes.OK).json({
      message: '회원이 추방되었습니다.',
    });
  } catch (error) {
    logger.error('회원 추방 오류:', error);
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ message: '회원 추방 중 오류가 발생했습니다.' });
  }
};

// 관리자 임명 (소유자)
export const promoteToAdmin = async (req: RequestWithClub, res: Response) => {
  try {
    const { userId } = req.body;
    const clubId = req.params.id;
    const club = req.club!; // isClubOwner 미들웨어에서 설정됨

    // 회원인지 확인
    const memberIndex = club.members.findIndex(
      (member: IClubMember) =>
        member.user.toString() === userId &&
        member.role === ClubMemberRole.MEMBER
    );

    if (memberIndex === -1) {
      res.status(StatusCodes.BAD_REQUEST).json({
        message: '해당 사용자는 동아리 회원이 아니거나 이미 관리자입니다.',
      });
      return;
    }

    // 관리자로 임명
    club.members[memberIndex].role = ClubMemberRole.ADMIN;
    await club.save();

    res.status(StatusCodes.OK).json({
      message: '관리자로 임명되었습니다.',
      member: club.members[memberIndex],
    });
  } catch (error) {
    logger.error('관리자 임명 오류:', error);
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ message: '관리자 임명 중 오류가 발생했습니다.' });
  }
};

// 관리자 해임 (소유자)
export const demoteFromAdmin = async (req: RequestWithClub, res: Response) => {
  try {
    const { userId } = req.body;
    const clubId = req.params.id;
    const club = req.club!; // isClubOwner 미들웨어에서 설정됨

    // 관리자인지 확인
    const memberIndex = club.members.findIndex(
      (member: IClubMember) =>
        member.user.toString() === userId &&
        member.role === ClubMemberRole.ADMIN
    );

    if (memberIndex === -1) {
      res
        .status(StatusCodes.BAD_REQUEST)
        .json({ message: '해당 사용자는 관리자가 아닙니다.' });
      return;
    }

    // 일반 회원으로 변경
    club.members[memberIndex].role = ClubMemberRole.MEMBER;
    await club.save();

    res.status(StatusCodes.OK).json({
      message: '관리자에서 해임되었습니다.',
      member: club.members[memberIndex],
    });
  } catch (error) {
    logger.error('관리자 해임 오류:', error);
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ message: '관리자 해임 중 오류가 발생했습니다.' });
  }
};
