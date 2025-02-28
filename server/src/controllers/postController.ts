import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import Post, { IPost } from '../models/Post';
import Board from '../models/Board';
import { logger } from '../utils/logger';

// 확장된 Request 인터페이스
interface RequestWithPost extends Request {
  post?: IPost;
}

// 게시글 목록 조회
export const getPosts = async (req: Request, res: Response) => {
  try {
    const { boardId, clubId } = req.params;
    const { page = 1, limit = 10, search } = req.query;

    const pageNumber = parseInt(page as string, 10);
    const limitNumber = parseInt(limit as string, 10);
    const skip = (pageNumber - 1) * limitNumber;

    // 검색 조건 구성
    let query: any = {
      board: boardId,
      club: clubId,
      isActive: true,
    };

    // 검색어가 있는 경우
    if (search) {
      query.$text = { $search: search as string };
    }

    // 게시글 조회
    const posts = await Post.find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limitNumber)
      .populate('author', 'username')
      .populate('board', 'name');

    // 전체 게시글 수 조회 (페이지네이션 정보)
    const totalPosts = await Post.countDocuments(query);

    res.status(StatusCodes.OK).json({
      posts,
      pagination: {
        total: totalPosts,
        page: pageNumber,
        limit: limitNumber,
        totalPages: Math.ceil(totalPosts / limitNumber),
      },
    });
  } catch (error) {
    logger.error('게시글 목록 조회 오류:', error);
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ message: '게시글 목록을 불러오는 중 오류가 발생했습니다.' });
  }
};

// 게시글 상세 조회
export const getPostById = async (req: Request, res: Response) => {
  try {
    const postId = req.params.postId;

    const post = await Post.findOne({
      _id: postId,
      isActive: true,
    })
      .populate('author', 'username')
      .populate('board', 'name');

    if (!post) {
      res
        .status(StatusCodes.NOT_FOUND)
        .json({ message: '게시글을 찾을 수 없습니다.' });
      return;
    }

    // 조회수 증가
    post.views += 1;
    await post.save();

    res.status(StatusCodes.OK).json({ post });
  } catch (error) {
    logger.error('게시글 상세 조회 오류:', error);
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ message: '게시글을 불러오는 중 오류가 발생했습니다.' });
  }
};

// 게시글 작성
export const createPost = async (req: Request, res: Response) => {
  try {
    const { title, content, attachments } = req.body;
    const { boardId, clubId } = req.params;
    const userId = req.user?.userId;

    // 게시판 존재 확인
    const board = await Board.findOne({
      _id: boardId,
      club: clubId,
      isActive: true,
    });

    if (!board) {
      res
        .status(StatusCodes.NOT_FOUND)
        .json({ message: '게시판을 찾을 수 없습니다.' });
      return;
    }

    const post = new Post({
      title,
      content,
      author: userId,
      board: boardId,
      club: clubId,
      attachments: attachments || [],
    });

    await post.save();

    res.status(StatusCodes.CREATED).json({
      message: '게시글이 작성되었습니다.',
      post,
    });
  } catch (error) {
    logger.error('게시글 작성 오류:', error);
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ message: '게시글 작성 중 오류가 발생했습니다.' });
  }
};

// 게시글 수정 (소유자 또는 관리자만 가능)
export const updatePost = async (req: RequestWithPost, res: Response) => {
  try {
    const { title, content, attachments } = req.body;
    const post = req.post!; // isPostOwnerOrAdmin 미들웨어에서 설정

    // 필드 업데이트
    if (title) post.title = title;
    if (content) post.content = content;
    if (attachments) post.attachments = attachments;

    await post.save();

    res.status(StatusCodes.OK).json({
      message: '게시글이 수정되었습니다.',
      post,
    });
  } catch (error) {
    logger.error('게시글 수정 오류:', error);
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ message: '게시글 수정 중 오류가 발생했습니다.' });
  }
};

// 게시글 삭제 (소유자 또는 관리자만 가능)
export const deletePost = async (req: RequestWithPost, res: Response) => {
  try {
    const post = req.post!; // isPostOwnerOrAdmin 미들웨어에서 설정

    // 소프트 삭제
    post.isActive = false;
    await post.save();

    res.status(StatusCodes.OK).json({
      message: '게시글이 삭제되었습니다.',
    });
  } catch (error) {
    logger.error('게시글 삭제 오류:', error);
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ message: '게시글 삭제 중 오류가 발생했습니다.' });
  }
};
