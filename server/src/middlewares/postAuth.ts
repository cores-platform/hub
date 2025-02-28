import { Request, Response, NextFunction } from 'express';
import { StatusCodes } from 'http-status-codes';
import Post, { IPost } from '../models/Post';
import Club, { ClubMemberRole } from '../models/Club';

// 확장된 Request 인터페이스 정의
interface RequestWithPost extends Request {
  post?: IPost;
}

// 게시글 소유자 확인 (또는 동아리 관리자)
export const isPostOwnerOrAdmin = async (
  req: RequestWithPost,
  res: Response,
  next: NextFunction
) => {
  try {
    const postId = req.params.postId;
    const userId = req.user?.userId;

    if (!userId) {
      res
        .status(StatusCodes.UNAUTHORIZED)
        .json({ message: '인증이 필요합니다.' });
      return;
    }

    const post = await Post.findById(postId);

    if (!post) {
      res
        .status(StatusCodes.NOT_FOUND)
        .json({ message: '게시글을 찾을 수 없습니다.' });
      return;
    }

    // 1. 게시글 작성자인 경우
    if (post.author.toString() === userId) {
      req.post = post;
      next();
      return;
    }

    // 2. 동아리 소유자 또는 관리자인 경우에도 접근 허용
    const club = await Club.findById(post.club);

    if (!club) {
      res
        .status(StatusCodes.NOT_FOUND)
        .json({ message: '동아리를 찾을 수 없습니다.' });
      return;
    }

    // 동아리 소유자인 경우
    if (club.owner.toString() === userId) {
      req.post = post;
      next();
      return;
    }

    // 동아리 관리자인 경우
    const isAdmin = club.members.some(
      (member) =>
        member.user.toString() === userId &&
        member.role === ClubMemberRole.ADMIN
    );

    if (isAdmin) {
      req.post = post;
      next();
      return;
    }

    // 권한 없음
    res
      .status(StatusCodes.FORBIDDEN)
      .json({ message: '이 게시글을 수정할 권한이 없습니다.' });
  } catch (error) {
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ message: '권한 확인 중 오류가 발생했습니다.' });
  }
};

// 동아리 회원 확인 (게시글 작성 및 조회 권한)
export const isClubMemberForPost = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const clubId = req.params.clubId;
    const userId = req.user?.userId;

    if (!userId) {
      res
        .status(StatusCodes.UNAUTHORIZED)
        .json({ message: '인증이 필요합니다.' });
      return;
    }

    const club = await Club.findById(clubId);

    if (!club) {
      res
        .status(StatusCodes.NOT_FOUND)
        .json({ message: '동아리를 찾을 수 없습니다.' });
      return;
    }

    // 소유자인 경우
    if (club.owner.toString() === userId) {
      next();
      return;
    }

    // 회원인 경우
    const isMember = club.members.some(
      (member) =>
        member.user.toString() === userId &&
        (member.role === ClubMemberRole.MEMBER ||
          member.role === ClubMemberRole.ADMIN)
    );

    if (isMember) {
      next();
      return;
    }

    // 회원이 아님
    res
      .status(StatusCodes.FORBIDDEN)
      .json({ message: '동아리 회원만 이 작업을 수행할 수 있습니다.' });
  } catch (error) {
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ message: '권한 확인 중 오류가 발생했습니다.' });
  }
};
