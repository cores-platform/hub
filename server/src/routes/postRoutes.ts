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
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 posts:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       _id:
 *                         type: string
 *                       title:
 *                         type: string
 *                       content:
 *                         type: string
 *                       author:
 *                         type: object
 *                         properties:
 *                           _id:
 *                             type: string
 *                           username:
 *                             type: string
 *                       board:
 *                         type: object
 *                         properties:
 *                           _id:
 *                             type: string
 *                           name:
 *                             type: string
 *                       createdAt:
 *                         type: string
 *                         format: date-time
 *                       updatedAt:
 *                         type: string
 *                         format: date-time
 *                 pagination:
 *                   type: object
 *                   properties:
 *                     total:
 *                       type: integer
 *                     page:
 *                       type: integer
 *                     limit:
 *                       type: integer
 *                     totalPages:
 *                       type: integer
 *             example:
 *               posts:
 *                 - _id: "60d21b4667d0d8992e610c85"
 *                   title: "첫 번째 게시글"
 *                   content: "이것은 첫 번째 게시글의 내용입니다."
 *                   author:
 *                     _id: "60d0fe4f5311236168a109ca"
 *                     username: "user1"
 *                   board:
 *                     _id: "60d21b4967d0d8992e610c86"
 *                     name: "공지사항"
 *                   createdAt: "2023-10-01T12:00:00Z"
 *                   updatedAt: "2023-10-01T12:00:00Z"
 *               pagination:
 *                 total: 100
 *                 page: 1
 *                 limit: 10
 *                 totalPages: 10
 *       403:
 *         description: 권한 없음 (동아리 회원이 아님)
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *             example:
 *               message: "권한이 없습니다."
 *       404:
 *         description: 게시판 또는 동아리를 찾을 수 없음
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *             example:
 *               message: "게시판을 찾을 수 없습니다."
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
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 post:
 *                   type: object
 *                   properties:
 *                     _id:
 *                       type: string
 *                     title:
 *                       type: string
 *                     content:
 *                       type: string
 *                     author:
 *                       type: object
 *                       properties:
 *                         _id:
 *                           type: string
 *                         username:
 *                           type: string
 *                     board:
 *                       type: object
 *                       properties:
 *                         _id:
 *                           type: string
 *                         name:
 *                           type: string
 *                     views:
 *                       type: integer
 *                     createdAt:
 *                       type: string
 *                       format: date-time
 *                     updatedAt:
 *                       type: string
 *                       format: date-time
 *             example:
 *               post:
 *                 _id: "60d21b4667d0d8992e610c85"
 *                 title: "첫 번째 게시글"
 *                 content: "이것은 첫 번째 게시글의 내용입니다."
 *                 author:
 *                   _id: "60d0fe4f5311236168a109ca"
 *                   username: "user1"
 *                 board:
 *                   _id: "60d21b4967d0d8992e610c86"
 *                   name: "공지사항"
 *                 views: 123
 *                 createdAt: "2023-10-01T12:00:00Z"
 *                 updatedAt: "2023-10-01T12:00:00Z"
 *       403:
 *         description: 권한 없음 (동아리 회원이 아님)
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *             example:
 *               message: "권한이 없습니다."
 *       404:
 *         description: 게시글을 찾을 수 없음
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *             example:
 *               message: "게시글을 찾을 수 없습니다."
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
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 post:
 *                   type: object
 *                   properties:
 *                     _id:
 *                       type: string
 *                     title:
 *                       type: string
 *                     content:
 *                       type: string
 *                     author:
 *                       type: string
 *                     board:
 *                       type: string
 *                     club:
 *                       type: string
 *                     attachments:
 *                       type: array
 *                       items:
 *                         type: string
 *                     createdAt:
 *                       type: string
 *                       format: date-time
 *                     updatedAt:
 *                       type: string
 *                       format: date-time
 *             example:
 *               message: "게시글이 작성되었습니다."
 *               post:
 *                 _id: "60d21b4667d0d8992e610c85"
 *                 title: "새로운 게시글"
 *                 content: "이것은 새로운 게시글의 내용입니다."
 *                 author: "60d0fe4f5311236168a109ca"
 *                 board: "60d21b4967d0d8992e610c86"
 *                 club: "60d21b4967d0d8992e610c87"
 *                 attachments: []
 *                 createdAt: "2023-10-01T12:00:00Z"
 *                 updatedAt: "2023-10-01T12:00:00Z"
 *       403:
 *         description: 권한 없음 (동아리 회원이 아님)
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *             example:
 *               message: "권한이 없습니다."
 *       404:
 *         description: 게시판을 찾을 수 없음
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *             example:
 *               message: "게시판을 찾을 수 없습니다."
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
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 post:
 *                   type: object
 *                   properties:
 *                     _id:
 *                       type: string
 *                     title:
 *                       type: string
 *                     content:
 *                       type: string
 *                     author:
 *                       type: string
 *                     board:
 *                       type: string
 *                     club:
 *                       type: string
 *                     attachments:
 *                       type: array
 *                       items:
 *                         type: string
 *                     createdAt:
 *                       type: string
 *                       format: date-time
 *                     updatedAt:
 *                       type: string
 *                       format: date-time
 *             example:
 *               message: "게시글이 수정되었습니다."
 *               post:
 *                 _id: "60d21b4667d0d8992e610c85"
 *                 title: "수정된 게시글"
 *                 content: "이것은 수정된 게시글의 내용입니다."
 *                 author: "60d0fe4f5311236168a109ca"
 *                 board: "60d21b4967d0d8992e610c86"
 *                 club: "60d21b4967d0d8992e610c87"
 *                 attachments: []
 *                 createdAt: "2023-10-01T12:00:00Z"
 *                 updatedAt: "2023-10-01T12:00:00Z"
 *       403:
 *         description: 권한 없음 (작성자 또는 관리자가 아님)
 *         content:
 *           application/json:!
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *             example:
 *               message: "권한이 없습니다."
 *       404:
 *         description: 게시글을 찾을 수 없음
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *             example:
 *               message: "게시글을 찾을 수 없습니다."
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
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *             example:
 *               message: "게시글이 삭제되었습니다."
 *       403:
 *         description: 권한 없음 (작성자 또는 관리자가 아님)
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *             example:
 *               message: "권한이 없습니다."
 *       404:
 *         description: 게시글을 찾을 수 없음
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *             example:
 *               message: "게시글을 찾을 수 없습니다."
 */
router.delete('/:postId', authenticate, isPostOwnerOrAdmin, deletePost);

export default router;
