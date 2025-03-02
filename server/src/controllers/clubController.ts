import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import Club, { ClubMemberRole } from '../models/Club';
import { logger } from '../utils/logger';

// 모든 동아리 조회 (공개 정보만)
export const getAllClubs = async (req: Request, res: Response) => {
  try {
    const { category, search, page = 1, limit = 10 } = req.query;

    // 쿼리 구성
    const query: any = { isActive: true };

    // 카테고리 필터링
    if (category) {
      query.category = category;
    }

    // 검색어 필터링
    if (search) {
      query.$text = { $search: search };
    }

    // 페이지네이션
    const skip = (Number(page) - 1) * Number(limit);

    const clubs = await Club.find(query)
      .select('name description category imageUrl members owner')
      .skip(skip)
      .limit(Number(limit))
      .populate('owner', 'username')
      .lean();

    // 각 동아리의 회원 수 계산 (PENDING 상태의 회원 제외)
    const clubsWithMemberCount = clubs.map((club) => {
      // 소유자는 항상 1명으로 카운트하고, 멤버와 관리자만 계산 (PENDING 제외)
      const activeMembers = club.members.filter(
        (member) =>
          member.role === ClubMemberRole.MEMBER ||
          member.role === ClubMemberRole.ADMIN
      );

      return {
        ...club,
        memberCount: activeMembers.length + 1, // 소유자 포함
        members: undefined, // 회원 정보는 제외하고 반환
      };
    });

    // 전체 동아리 수 조회 (페이지네이션 정보용)
    const total = await Club.countDocuments(query);

    res.status(StatusCodes.OK).json({
      clubs: clubsWithMemberCount,
      pagination: {
        total,
        page: Number(page),
        limit: Number(limit),
        pages: Math.ceil(total / Number(limit)),
      },
    });
  } catch (error) {
    logger.error('동아리 조회 오류:', error);
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ message: '동아리 조회 중 오류가 발생했습니다.' });
  }
};

// 특정 동아리 조회
export const getClubById = async (req: Request, res: Response) => {
  try {
    const clubId = req.params.id;
    const userId = req.user?.userId;

    const club = await Club.findById(clubId)
      .populate('owner', 'username email profileImage')
      .populate('members.user', 'username email profileImage');

    if (!club) {
      res
        .status(StatusCodes.NOT_FOUND)
        .json({ message: '동아리를 찾을 수 없습니다.' });
      return;
    }

    // 현재 사용자의 동아리 가입 상태 확인
    let userMembershipStatus = 'none';

    if (club.owner.toString() === userId) {
      userMembershipStatus = 'owner';
    } else if (userId) {
      const memberInfo = club.members.find(
        (member) => member.user._id.toString() === userId
      );

      if (memberInfo) {
        userMembershipStatus = memberInfo.role;
      }
    }

    // 활성 회원만 필터링 (PENDING 제외)
    const activeMembers = club.members.filter(
      (member) =>
        member.role === ClubMemberRole.MEMBER ||
        member.role === ClubMemberRole.ADMIN
    );

    // 반환할 동아리 정보 구성
    const clubInfo = {
      _id: club._id,
      name: club.name,
      description: club.description,
      category: club.category,
      imageUrl: club.imageUrl,
      owner: club.owner,
      isActive: club.isActive,
      isPrivate: club.isPrivate,
      memberCount: activeMembers.length + 1, // 소유자 포함, PENDING 제외
      userMembershipStatus,
      allMembers: club.members,
      admins: club.members
        .filter((member) => member.role === ClubMemberRole.ADMIN)
        .map((admin) => admin),
      members: club.members
        .filter((member) => member.role === ClubMemberRole.MEMBER)
        .map((member) => member),
      pendingMembers: club.members
        .filter((member) => member.role === ClubMemberRole.PENDING)
        .map((member) => member),
      createdAt: club.createdAt,
      updatedAt: club.updatedAt,
    };

    res.status(StatusCodes.OK).json({ club: clubInfo });
  } catch (error) {
    logger.error('동아리 조회 오류:', error);
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ message: '동아리 조회 중 오류가 발생했습니다.' });
  }
};

// 동아리 가입 신청
export const joinClub = async (req: Request, res: Response) => {
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

    // 이미 가입 신청했거나 회원인지 확인
    const isAlreadyMember = club.members.some(
      (member) => member.user.toString() === userId
    );

    if (club.owner.toString() === userId) {
      res
        .status(StatusCodes.BAD_REQUEST)
        .json({ message: '이미 동아리의 소유자입니다.' });
      return;
    }

    if (isAlreadyMember) {
      res
        .status(StatusCodes.BAD_REQUEST)
        .json({ message: '이미 동아리에 가입했거나 가입 신청 중입니다.' });
      return;
    }

    // 동아리가 비공개인 경우 가입 승인 대기 상태로 추가
    const role = club.isPrivate
      ? ClubMemberRole.PENDING
      : ClubMemberRole.MEMBER;

    club.members.push({
      user: userId as any,
      role,
      joinedAt: new Date(),
    });

    await club.save();

    const message = club.isPrivate
      ? '동아리 가입 신청이 완료되었습니다. 관리자의 승인을 기다려주세요.'
      : '동아리에 성공적으로 가입했습니다.';

    res.status(StatusCodes.OK).json({ message, role });
  } catch (error) {
    logger.error('동아리 가입 오류:', error);
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ message: '동아리 가입 중 오류가 발생했습니다.' });
  }
};

// 동아리 탈퇴
export const leaveClub = async (req: Request, res: Response) => {
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

    // 소유자는 탈퇴할 수 없음
    if (club.owner.toString() === userId) {
      res.status(StatusCodes.BAD_REQUEST).json({
        message:
          '동아리 소유자는 탈퇴할 수 없습니다. 먼저 소유권을 이전하세요.',
      });
      return;
    }

    // 회원인지 확인
    const memberIndex = club.members.findIndex(
      (member) => member.user.toString() === userId
    );

    if (memberIndex === -1) {
      res
        .status(StatusCodes.BAD_REQUEST)
        .json({ message: '동아리 회원이 아닙니다.' });
      return;
    }

    // 회원 제거
    club.members.splice(memberIndex, 1);
    await club.save();

    res
      .status(StatusCodes.OK)
      .json({ message: '동아리에서 탈퇴했습니다.' });
  } catch (error) {
    logger.error('동아리 탈퇴 오류:', error);
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ message: '동아리 탈퇴 중 오류가 발생했습니다.' });
  }
};
