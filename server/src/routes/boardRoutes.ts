import express from 'express';
import {
  getBoards,
  getBoardById,
  createBoard,
  updateBoard,
  deleteBoard,
} from '../controllers/boardController';
import { authenticate } from '../middlewares/auth';
import { isClubMember, isClubAdmin } from '../middlewares/clubAuth';

const router = express.Router({ mergeParams: true }); // clubId 파라미터 접근 위해

/**
 * @swagger
 * tags:
 *   - name: 게시판
 *     description: 동아리 게시판 관리 API
 */

/**
 * @swagger
 * /api/clubs/{clubId}/boards:
 *   get:
 *     summary: 게시판 목록 조회
 *     description: 동아리 내 모든 게시판을 조회합니다.
 *     tags: [게시판]
 *     parameters:
 *       - in: path
 *         name: clubId
 *         required: true
 *         schema:
 *           type: string
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: 게시판 목록 반환
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 boards:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       _id:
 *                         type: string
 *                       name:
 *                         type: string
 *                       description:
 *                         type: string
 *                       club:
 *                         type: string
 *                       isActive:
 *                         type: boolean
 *                       createdBy:
 *                         type: string
 *                       createdAt:
 *                         type: string
 *                         format: date-time
 *                       updatedAt:
 *                         type: string
 *                         format: date-time
 *       404:
 *         description: 동아리를 찾을 수 없음
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "동아리를 찾을 수 없습니다."
 */
router.get('/', authenticate, isClubMember, getBoards);

/**
 * @swagger
 * /api/clubs/{clubId}/boards/{boardId}:
 *   get:
 *     summary: 게시판 상세 조회
 *     description: 특정 게시판의 정보를 조회합니다.
 *     tags: [게시판]
 *     parameters:
 *       - in: path
 *         name: clubId
 *         required: true
 *         schema:
 *           type: string
 *       - in: path
 *         name: boardId
 *         required: true
 *         schema:
 *           type: string
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: 게시판 정보 반환
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 board:
 *                   type: object
 *                   properties:
 *                     _id:
 *                       type: string
 *                     name:
 *                       type: string
 *                     description:
 *                       type: string
 *                     club:
 *                       type: string
 *                     isActive:
 *                       type: boolean
 *                     createdBy:
 *                       type: string
 *                     createdAt:
 *                       type: string
 *                       format: date-time
 *                     updatedAt:
 *                       type: string
 *                       format: date-time
 *       404:
 *         description: 게시판 또는 동아리를 찾을 수 없음
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "게시판을 찾을 수 없습니다."
 */
router.get('/:boardId', authenticate, isClubMember, getBoardById);

/**
 * @swagger
 * /api/clubs/{clubId}/boards:
 *   post:
 *     summary: 새 게시판 생성
 *     description: 동아리 소유자 또는 관리자가 새 게시판을 생성합니다.
 *     tags: [게시판]
 *     parameters:
 *       - in: path
 *         name: clubId
 *         required: true
 *         schema:
 *           type: string
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *             properties:
 *               name:
 *                 type: string
 *                 description: 게시판 이름
 *               description:
 *                 type: string
 *                 description: 게시판 설명
 *     responses:
 *       201:
 *         description: 게시판 생성 성공
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "게시판이 생성되었습니다."
 *                 board:
 *                   type: object
 *                   properties:
 *                     _id:
 *                       type: string
 *                     name:
 *                       type: string
 *                     description:
 *                       type: string
 *                     club:
 *                       type: string
 *                     isActive:
 *                       type: boolean
 *                     createdBy:
 *                       type: string
 *                     createdAt:
 *                       type: string
 *                       format: date-time
 *                     updatedAt:
 *                       type: string
 *                       format: date-time
 *       400:
 *         description: 이미 존재하는 게시판 이름
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "이미 동일한 이름의 게시판이 존재합니다."
 *       403:
 *         description: 권한 없음 (관리자가 아님)
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "동아리 관리자만 이 작업을 수행할 수 있습니다."
 */
router.post('/', authenticate, isClubAdmin, createBoard);

/**
 * @swagger
 * /api/clubs/{clubId}/boards/{boardId}:
 *   put:
 *     summary: 게시판 정보 수정
 *     description: 동아리 소유자 또는 관리자가 게시판 정보를 수정합니다.
 *     tags: [게시판]
 *     parameters:
 *       - in: path
 *         name: clubId
 *         required: true
 *         schema:
 *           type: string
 *       - in: path
 *         name: boardId
 *         required: true
 *         schema:
 *           type: string
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 description: 게시판 이름
 *               description:
 *                 type: string
 *                 description: 게시판 설명
 *               isActive:
 *                 type: boolean
 *                 description: 활성화 여부
 *     responses:
 *       200:
 *         description: 게시판 수정 성공
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "게시판이 수정되었습니다."
 *                 board:
 *                   type: object
 *                   properties:
 *                     _id:
 *                       type: string
 *                     name:
 *                       type: string
 *                     description:
 *                       type: string
 *                     club:
 *                       type: string
 *                     isActive:
 *                       type: boolean
 *                     createdBy:
 *                       type: string
 *                     createdAt:
 *                       type: string
 *                       format: date-time
 *                     updatedAt:
 *                       type: string
 *                       format: date-time
 *       400:
 *         description: 이미 존재하는 게시판 이름
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "이미 동일한 이름의 게시판이 존재합니다."
 *       403:
 *         description: 권한 없음 (관리자가 아님)
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "동아리 관리자만 이 작업을 수행할 수 있습니다."
 *       404:
 *         description: 게시판을 찾을 수 없음
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "게시판을 찾을 수 없습니다."
 */
router.put('/:boardId', authenticate, isClubAdmin, updateBoard);

/**
 * @swagger
 * /api/clubs/{clubId}/boards/{boardId}:
 *   delete:
 *     summary: 게시판 삭제
 *     description: 동아리 소유자 또는 관리자가 게시판을 삭제합니다. (실제로는 비활성화)
 *     tags: [게시판]
 *     parameters:
 *       - in: path
 *         name: clubId
 *         required: true
 *         schema:
 *           type: string
 *       - in: path
 *         name: boardId
 *         required: true
 *         schema:
 *           type: string
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: 게시판 삭제 성공
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "게시판이 삭제되었습니다."
 *       403:
 *         description: 권한 없음 (관리자가 아님)
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "동아리 관리자만 이 작업을 수행할 수 있습니다."
 *       404:
 *         description: 게시판을 찾을 수 없음
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "게시판을 찾을 수 없습니다."
 */
router.delete('/:boardId', authenticate, isClubAdmin, deleteBoard);

export default router;
