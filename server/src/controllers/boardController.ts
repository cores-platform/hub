import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import Board, { IBoard } from '../models/Board';
import Club, { ClubMemberRole } from '../models/Club';
import { logger } from '../utils/logger';

// Request 확장 인터페이스
interface RequestWithClub extends Request {
  club?: any;
}

// 게시판 목록 조회
export const getBoards = async (req: Request, res: Response) => {
  try {
    const clubId = req.params.clubId;

    const boards = await Board.find({
      club: clubId,
      isActive: true,
    }).sort({ createdAt: -1 });

    console.log(boards);

    res.status(StatusCodes.OK).json({ boards });
  } catch (error) {
    logger.error('게시판 목록 조회 오류:', error);
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ message: '게시판 목록을 불러오는 중 오류가 발생했습니다.' });
  }
};

// 게시판 상세 조회
export const getBoardById = async (req: Request, res: Response) => {
  try {
    const boardId = req.params.boardId;

    const board = await Board.findOne({
      _id: boardId,
      isActive: true,
    });

    if (!board) {
      res
        .status(StatusCodes.NOT_FOUND)
        .json({ message: '게시판을 찾을 수 없습니다.' });
      return;
    }

    res.status(StatusCodes.OK).json({ board });
  } catch (error) {
    logger.error('게시판 상세 조회 오류:', error);
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ message: '게시판을 불러오는 중 오류가 발생했습니다.' });
  }
};

// 게시판 생성 (소유자 또는 관리자만 가능)
export const createBoard = async (req: RequestWithClub, res: Response) => {
  try {
    const { name, description } = req.body;
    const clubId = req.params.clubId;
    const userId = req.user?.userId;

    // 이름 중복 확인
    const existingBoard = await Board.findOne({
      name,
      club: clubId,
    });

    if (existingBoard) {
      res
        .status(StatusCodes.BAD_REQUEST)
        .json({ message: '이미 동일한 이름의 게시판이 존재합니다.' });
      return;
    }

    const board = new Board({
      name,
      description,
      club: clubId,
      createdBy: userId,
    });

    await board.save();

    res.status(StatusCodes.CREATED).json({
      message: '게시판이 생성되었습니다.',
      board,
    });
  } catch (error) {
    logger.error('게시판 생성 오류:', error);
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ message: '게시판 생성 중 오류가 발생했습니다.' });
  }
};

// 게시판 수정 (소유자 또는 관리자만 가능)
export const updateBoard = async (req: Request, res: Response) => {
  try {
    const { name, description, isActive } = req.body;
    const boardId = req.params.boardId;
    const clubId = req.params.clubId;

    // 게시판 존재 확인
    const board = await Board.findById(boardId);

    if (!board) {
      res
        .status(StatusCodes.NOT_FOUND)
        .json({ message: '게시판을 찾을 수 없습니다.' });
      return;
    }

    // 이름 변경 시 중복 확인
    if (name && name !== board.name) {
      const existingBoard = await Board.findOne({
        name,
        club: clubId,
        _id: { $ne: boardId }, // 현재 게시판 제외
      });

      if (existingBoard) {
        res
          .status(StatusCodes.BAD_REQUEST)
          .json({ message: '이미 동일한 이름의 게시판이 존재합니다.' });
        return;
      }

      board.name = name;
    }

    // 다른 필드 업데이트
    if (description !== undefined) board.description = description;
    if (isActive !== undefined) board.isActive = isActive;

    await board.save();

    res.status(StatusCodes.OK).json({
      message: '게시판이 수정되었습니다.',
      board,
    });
  } catch (error) {
    logger.error('게시판 수정 오류:', error);
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ message: '게시판 수정 중 오류가 발생했습니다.' });
  }
};

// 게시판 삭제 (소유자 또는 관리자만 가능)
export const deleteBoard = async (req: Request, res: Response) => {
  try {
    const boardId = req.params.boardId;

    // 게시판 존재 확인
    const board = await Board.findById(boardId);

    if (!board) {
      res
        .status(StatusCodes.NOT_FOUND)
        .json({ message: '게시판을 찾을 수 없습니다.' });
      return;
    }

    // 소프트 삭제 (isActive = false)
    board.isActive = false;
    await board.save();

    res.status(StatusCodes.OK).json({
      message: '게시판이 삭제되었습니다.',
    });
  } catch (error) {
    logger.error('게시판 삭제 오류:', error);
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ message: '게시판 삭제 중 오류가 발생했습니다.' });
  }
};
