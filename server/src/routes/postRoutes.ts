import express from 'express';
import {
  getPosts,
  getPostById,
  createPost,
  updatePost,
  deletePost,
} from '../controllers/postController';
import { authenticate } from '../middlewares/auth';
import { isClubMemberForPost } from '../middlewares/postAuth';
import { isPostOwnerOrAdmin } from '../middlewares/postAuth';

const router = express.Router({ mergeParams: true }); // clubId, boardId 파라미터 접근 위해

/**
 * @swagger
 * tags:
 *   - name: 게시글
 *     description: 동아리 게시판 내 게시글 관리 API
 */

/**
 * @swagger
 * /api/clubs/{clubId}/boards/{boardId}/posts:
 *   get:
 *     summary: 게시글 목록 조회
 *     description: 특정 게시판의 모든 게시글을 조회합니다.
 *     tags: [게시글]
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
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *         description: 페이지 번호
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 10
 *         description: 페이지당 항목 수
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *         description: 검색어 (제목 또는 내용)
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: 게시글 목록 반환
 *       403:
 *         description: 권한 없음 (동아리 회원이 아님)
 *       404:
 *         description: 게시판 또는 동아리를 찾을 수 없음
 */
router.get('/', authenticate, isClubMemberForPost, getPosts);

/**
 * @swagger
 * /api/clubs/{clubId}/boards/{boardId}/posts/{postId}:
 *   get:
 *     summary: 게시글 상세 조회
 *     description: 특정 게시글의 상세 정보를 조회합니다.
 *     tags: [게시글]
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
 *       - in: path
 *         name: postId
 *         required: true
 *         schema:
 *           type: string
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: 게시글 정보 반환
 *       403:
 *         description: 권한 없음 (동아리 회원이 아님)
 *       404:
 *         description: 게시글을 찾을 수 없음
 */
router.get('/:postId', authenticate, isClubMemberForPost, getPostById);

/**
 * @swagger
 * /api/clubs/{clubId}/boards/{boardId}/posts:
 *   post:
 *     summary: 새 게시글 작성
 *     description: 동아리 회원이 새 게시글을 작성합니다.
 *     tags: [게시글]
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
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - title
 *               - content
 *             properties:
 *               title:
 *                 type: string
 *                 description: 게시글 제목
 *               content:
 *                 type: string
 *                 description: 게시글 내용
 *               attachments:
 *                 type: array
 *                 description: 첨부파일 URL 목록
 *                 items:
 *                   type: string
 *     responses:
 *       201:
 *         description: 게시글 작성 성공
 *       403:
 *         description: 권한 없음 (동아리 회원이 아님)
 *       404:
 *         description: 게시판을 찾을 수 없음
 */
router.post('/', authenticate, isClubMemberForPost, createPost);

/**
 * @swagger
 * /api/clubs/{clubId}/boards/{boardId}/posts/{postId}:
 *   put:
 *     summary: 게시글 수정
 *     description: 게시글 작성자 또는 동아리 관리자가 게시글을 수정합니다.
 *     tags: [게시글]
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
 *       - in: path
 *         name: postId
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
 *               title:
 *                 type: string
 *                 description: 게시글 제목
 *               content:
 *                 type: string
 *                 description: 게시글 내용
 *               attachments:
 *                 type: array
 *                 description: 첨부파일 URL 목록
 *                 items:
 *                   type: string
 *     responses:
 *       200:
 *         description: 게시글 수정 성공
 *       403:
 *         description: 권한 없음 (작성자 또는 관리자가 아님)
 *       404:
 *         description: 게시글을 찾을 수 없음
 */
router.put('/:postId', authenticate, isPostOwnerOrAdmin, updatePost);

/**
 * @swagger
 * /api/clubs/{clubId}/boards/{boardId}/posts/{postId}:
 *   delete:
 *     summary: 게시글 삭제
 *     description: 게시글 작성자 또는 동아리 관리자가 게시글을 삭제합니다.
 *     tags: [게시글]
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
 *       - in: path
 *         name: postId
 *         required: true
 *         schema:
 *           type: string
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: 게시글 삭제 성공
 *       403:
 *         description: 권한 없음 (작성자 또는 관리자가 아님)
 *       404:
 *         description: 게시글을 찾을 수 없음
 */
router.delete('/:postId', authenticate, isPostOwnerOrAdmin, deletePost);

export default router; 