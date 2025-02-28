import express from 'express';
import {
  getUsers,
  getUserById,
  updateUser,
  deleteUser,
} from '../controllers/userController';
import { authenticate, isAdmin } from '../middlewares/auth';

const router = express.Router();

// 모든 라우트에 인증 및 관리자 권한 검사 미들웨어 적용
router.use(authenticate, isAdmin);

/**
 * @swagger
 * /api/admin/users:
 *   get:
 *     summary: 모든 사용자 조회 (관리자 전용)
 *     tags: [관리자]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: 사용자 목록 반환
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 users:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       _id:
 *                         type: string
 *                       username:
 *                         type: string
 *                       email:
 *                         type: string
 *                       firstName:
 *                         type: string
 *                       lastName:
 *                         type: string
 *                       role:
 *                         type: string
 *                         enum: [user, admin]
 *             example:
 *               users:
 *                 - _id: "60d0fe4f5311236168a109ca"
 *                   username: "admin"
 *                   email: "admin@example.com"
 *                   firstName: "Admin"
 *                   lastName: "User"
 *                   role: "admin"
 *       401:
 *         description: 인증되지 않음
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *             example:
 *               message: "인증이 필요합니다."
 *       403:
 *         description: 권한 없음
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *             example:
 *               message: "관리자 권한이 필요합니다."
 */
router.get('/users', getUsers);

/**
 * @swagger
 * /api/admin/users/{id}:
 *   get:
 *     summary: 특정 사용자 조회 (관리자 전용)
 *     tags: [관리자]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: 사용자 정보 반환
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 user:
 *                   type: object
 *                   properties:
 *                     _id:
 *                       type: string
 *                     username:
 *                       type: string
 *                     email:
 *                       type: string
 *                     firstName:
 *                       type: string
 *                     lastName:
 *                       type: string
 *                     role:
 *                       type: string
 *                       enum: [user, admin]
 *             example:
 *               user:
 *                 _id: "60d0fe4f5311236168a109ca"
 *                 username: "admin"
 *                 email: "admin@example.com"
 *                 firstName: "Admin"
 *                 lastName: "User"
 *                 role: "admin"
 *       404:
 *         description: 사용자를 찾을 수 없음
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *             example:
 *               message: "사용자를 찾을 수 없습니다."
 */
router.get('/users/:id', getUserById);

/**
 * @swagger
 * /api/admin/users/{id}:
 *   put:
 *     summary: 사용자 정보 업데이트 (관리자 전용)
 *     tags: [관리자]
 *     parameters:
 *       - in: path
 *         name: id
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
 *               username:
 *                 type: string
 *               email:
 *                 type: string
 *               firstName:
 *                 type: string
 *               lastName:
 *                 type: string
 *               profileImage:
 *                 type: string
 *               role:
 *                 type: string
 *                 enum: [user, admin]
 *               isActive:
 *                 type: boolean
 *     responses:
 *       200:
 *         description: 사용자 정보 업데이트 성공
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 user:
 *                   type: object
 *                   properties:
 *                     _id:
 *                       type: string
 *                     username:
 *                       type: string
 *                     email:
 *                       type: string
 *                     firstName:
 *                       type: string
 *                     lastName:
 *                       type: string
 *                     profileImage:
 *                       type: string
 *                     role:
 *                       type: string
 *                       enum: [user, admin]
 *             example:
 *               user:
 *                 _id: "60d0fe4f5311236168a109ca"
 *                 username: "admin"
 *                 email: "admin@example.com"
 *                 firstName: "Admin"
 *                 lastName: "User"
 *                 profileImage: "profile.jpg"
 *                 role: "admin"
 *       404:
 *         description: 사용자를 찾을 수 없음
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *             example:
 *               message: "사용자를 찾을 수 없습니다."
 */
router.put('/users/:id', updateUser);

/**
 * @swagger
 * /api/admin/users/{id}:
 *   delete:
 *     summary: 사용자 삭제 (관리자 전용)
 *     tags: [관리자]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: 사용자 삭제 성공
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *             example:
 *               message: "사용자가 삭제되었습니다."
 *       404:
 *         description: 사용자를 찾을 수 없음
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *             example:
 *               message: "사용자를 찾을 수 없습니다."
 */
router.delete('/users/:id', deleteUser);

export default router;
