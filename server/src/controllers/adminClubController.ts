import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import Club, { ClubMemberRole } from '../models/Club';
import User from '../models/User';
import { logger } from '../utils/logger';

// 모든 동아리 조회
export const getAllClubs = async (req: Request, res: Response) => {
  try {
    const clubs = await Club.find()
      .populate('owner', 'username email')
      .populate('members.user', 'username email');
    
    res.status(StatusCodes.OK).json({ clubs });
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
    const club = await Club.findById(req.params.id)
      .populate('owner', 'username email')
      .populate('members.user', 'username email');
    
    if (!club) {
      res
        .status(StatusCodes.NOT_FOUND)
        .json({ message: '동아리를 찾을 수 없습니다.' });
      return;
    }
    
    res.status(StatusCodes.OK).json({ club });
  } catch (error) {
    logger.error('동아리 조회 오류:', error);
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ message: '동아리 조회 중 오류가 발생했습니다.' });
  }
};

// 동아리 생성
export const createClub = async (req: Request, res: Response) => {
  try {
    const { name, description, category, imageUrl, ownerId, isPrivate } = req.body;
    
    // 동아리 이름 중복 확인
    const existingClub = await Club.findOne({ name });
    if (existingClub) {
      res
        .status(StatusCodes.BAD_REQUEST)
        .json({ message: '이미 존재하는 동아리 이름입니다.' });
      return;
    }
    
    // 소유자로 설정할 사용자 확인
    const owner = await User.findById(ownerId || req.user?.userId);
    if (!owner) {
      res
        .status(StatusCodes.BAD_REQUEST)
        .json({ message: '지정한 소유자를 찾을 수 없습니다.' });
      return;
    }
    
    const club = await Club.create({
      name,
      description,
      category,
      imageUrl,
      owner: ownerId || req.user?.userId,
      isPrivate: isPrivate !== undefined ? isPrivate : true,
      members: [] // 처음에는 빈 멤버 목록으로 시작
    });
    
    res.status(StatusCodes.CREATED).json({ club });
  } catch (error) {
    logger.error('동아리 생성 오류:', error);
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ message: '동아리 생성 중 오류가 발생했습니다.' });
  }
};

// 동아리 업데이트
export const updateClub = async (req: Request, res: Response) => {
  try {
    const { name, description, category, imageUrl, isActive, isPrivate, ownerId } = req.body;
    const clubId = req.params.id;
    
    const club = await Club.findById(clubId);
    if (!club) {
      res
        .status(StatusCodes.NOT_FOUND)
        .json({ message: '동아리를 찾을 수 없습니다.' });
      return;
    }
    
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
    
    // 소유자 변경 시 사용자 확인
    if (ownerId && ownerId !== club.owner.toString()) {
      const newOwner = await User.findById(ownerId);
      if (!newOwner) {
        res
          .status(StatusCodes.BAD_REQUEST)
          .json({ message: '지정한 소유자를 찾을 수 없습니다.' });
        return;
      }
      
      // 이전 소유자가 회원이 아니었다면 관리자로 추가
      const oldOwnerId = club.owner;
      const oldOwnerIsMember = club.members.some(
        member => member.user.toString() === oldOwnerId.toString()
      );
      
      if (!oldOwnerIsMember) {
        club.members.push({
          user: oldOwnerId,
          role: ClubMemberRole.ADMIN,
          joinedAt: new Date()
        });
      } else {
        // 이미 회원이면 역할을 관리자로 변경
        const memberIndex = club.members.findIndex(
          member => member.user.toString() === oldOwnerId.toString()
        );
        club.members[memberIndex].role = ClubMemberRole.ADMIN;
      }
      
      // 새 소유자가 이미 회원이면 회원 목록에서 제거
      const newOwnerMemberIndex = club.members.findIndex(
        member => member.user.toString() === ownerId
      );
      
      if (newOwnerMemberIndex !== -1) {
        club.members.splice(newOwnerMemberIndex, 1);
      }
      
      club.owner = ownerId as any;
    }
    
    // 업데이트할 필드만 변경
    if (description) club.description = description;
    if (category) club.category = category;
    if (imageUrl) club.imageUrl = imageUrl;
    if (isActive !== undefined) club.isActive = isActive;
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

// 동아리 삭제
export const deleteClub = async (req: Request, res: Response) => {
  try {
    const clubId = req.params.id;
    
    // 동아리 존재 여부 확인
    const club = await Club.findById(clubId);
    if (!club) {
      res
        .status(StatusCodes.NOT_FOUND)
        .json({ message: '동아리를 찾을 수 없습니다.' });
      return;
    }
    
    await Club.findByIdAndDelete(clubId);
    
    res.status(StatusCodes.OK).json({ message: '동아리가 삭제되었습니다.' });
  } catch (error) {
    logger.error('동아리 삭제 오류:', error);
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ message: '동아리 삭제 중 오류가 발생했습니다.' });
  }
};

// 동아리 전체 회원 조회
export const getClubMembers = async (req: Request, res: Response) => {
  try {
    const clubId = req.params.id;
    
    const club = await Club.findById(clubId)
      .populate('owner', 'username email profileImage')
      .populate('members.user', 'username email profileImage');
    
    if (!club) {
      res
        .status(StatusCodes.NOT_FOUND)
        .json({ message: '동아리를 찾을 수 없습니다.' });
      return;
    }
    
    // 소유자와 모든 회원 정보 구성
    const owner = {
      user: club.owner,
      role: 'owner',
      joinedAt: club.createdAt
    };
    
    const members = [owner, ...club.members];
    
    res.status(StatusCodes.OK).json({ members });
  } catch (error) {
    logger.error('동아리 회원 조회 오류:', error);
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ message: '동아리 회원 조회 중 오류가 발생했습니다.' });
  }
};

// 회원 가입 상태 관리 (승인/거부/추방)
export const updateMemberStatus = async (req: Request, res: Response) => {
  try {
    const { userId, action } = req.body;
    const clubId = req.params.id;
    
    const club = await Club.findById(clubId);
    if (!club) {
      res
        .status(StatusCodes.NOT_FOUND)
        .json({ message: '동아리를 찾을 수 없습니다.' });
      return;
    }
    
    // 소유자는 변경할 수 없음
    if (club.owner.toString() === userId) {
      res
        .status(StatusCodes.BAD_REQUEST)
        .json({ message: '동아리 소유자의 상태는 변경할 수 없습니다.' });
      return;
    }
    
    // 멤버 인덱스 찾기
    const memberIndex = club.members.findIndex(
      member => member.user.toString() === userId
    );
    
    if (memberIndex === -1 && action !== 'add') {
      res
        .status(StatusCodes.BAD_REQUEST)
        .json({ message: '해당 사용자는 동아리 회원이 아닙니다.' });
      return;
    }
    
    // 액션에 따라 처리
    switch (action) {
      case 'approve': // 가입 승인
        if (club.members[memberIndex].role !== ClubMemberRole.PENDING) {
          res
            .status(StatusCodes.BAD_REQUEST)
            .json({ message: '승인 대기 중인 회원이 아닙니다.' });
          return;
        }
        club.members[memberIndex].role = ClubMemberRole.MEMBER;
        await club.save();
        res.status(StatusCodes.OK).json({ 
          message: '가입 신청이 승인되었습니다.',
          member: club.members[memberIndex]
        });
        break;
        
      case 'reject': // 가입 거부
        if (club.members[memberIndex].role !== ClubMemberRole.PENDING) {
          res
            .status(StatusCodes.BAD_REQUEST)
            .json({ message: '승인 대기 중인 회원이 아닙니다.' });
          return;
        }
        club.members.splice(memberIndex, 1);
        await club.save();
        res.status(StatusCodes.OK).json({ 
          message: '가입 신청이 거부되었습니다.'
        });
        break;
        
      case 'kick': // 회원 추방
        club.members.splice(memberIndex, 1);
        await club.save();
        res.status(StatusCodes.OK).json({ 
          message: '회원이 추방되었습니다.'
        });
        break;
        
      case 'add': // 직접 회원 추가
        // 사용자 존재 확인
        const user = await User.findById(userId);
        if (!user) {
          res
            .status(StatusCodes.BAD_REQUEST)
            .json({ message: '사용자를 찾을 수 없습니다.' });
          return;
        }
        
        // 이미 회원인지 확인
        if (memberIndex !== -1) {
          res
            .status(StatusCodes.BAD_REQUEST)
            .json({ message: '이미 동아리 회원입니다.' });
          return;
        }
        
        // 소유자인지 확인
        if (club.owner.toString() === userId) {
          res
            .status(StatusCodes.BAD_REQUEST)
            .json({ message: '이미 동아리 소유자입니다.' });
          return;
        }
        
        // 회원 추가
        club.members.push({
          user: userId as any,
          role: ClubMemberRole.MEMBER,
          joinedAt: new Date()
        });
        
        await club.save();
        res.status(StatusCodes.OK).json({ 
          message: '회원이 추가되었습니다.'
        });
        break;
        
      default:
        res
          .status(StatusCodes.BAD_REQUEST)
          .json({ message: '유효하지 않은 액션입니다.' });
    }
  } catch (error) {
    logger.error('회원 상태 변경 오류:', error);
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ message: '회원 상태 변경 중 오류가 발생했습니다.' });
  }
}; 