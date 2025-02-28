import express from 'express';
import {
  createUser,
  loginUser,
  getUserProfile,
  updateUserProfile,
  changePassword,
} from '../controllers/userController';
import { authenticate } from '../middlewares/auth';

const router = express.Router();

/**
 * @swagger
 * tags:
 *   - name: 사용자
 *     description: 사용자 관련 API
 *   - name: 인증
 *     description: 인증 관련 API
 *   - name: 관리자
 *     description: 관리자 전용 API
 */

/**
 * @swagger
 * /api/user/register:
 *   post:
 *     summary: 새 사용자 등록
 *     tags: [사용자]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - username
 *               - email
 *               - password
 *             properties:
 *               username:
 *                 type: string
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *               firstName:
 *                 type: string
 *               lastName:
 *                 type: string
 *     responses:
 *       201:
 *         description: 사용자 등록 성공
 */
router.post('/register', createUser);

/**
 * @swagger
 * /api/user/login:
 *   post:
 *     summary: 사용자 로그인
 *     tags: [인증]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *                 example: "admin@example.com"
 *               password:
 *                 type: string
 *                 example: "admin123"
 *     responses:
 *       200:
 *         description: 로그인 성공
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/LoginResponse'
 *       401:
 *         description: 인증 실패
 *     x-swagger-router-controller: "userController"
 */
router.post('/login', loginUser);

/**
 * @swagger
 * /api/user/profile:
 *   get:
 *     summary: 현재 로그인한 사용자의 프로필 조회
 *     tags: [사용자]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: 사용자 프로필 정보 반환
 *       401:
 *         description: 인증되지 않음
 */
router.get('/profile', authenticate, getUserProfile);

/**
 * @swagger
 * /api/user/profile:
 *   put:
 *     summary: 현재 로그인한 사용자의 프로필 업데이트
 *     tags: [사용자]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               firstName:
 *                 type: string
 *               lastName:
 *                 type: string
 *               profileImage:
 *                 type: string
 *     responses:
 *       200:
 *         description: 프로필 업데이트 성공
 *       401:
 *         description: 인증되지 않음
 */
router.put('/profile', authenticate, updateUserProfile);

/**
 * @swagger
 * /api/user/change-password:
 *   post:
 *     summary: 비밀번호 변경
 *     tags: [사용자]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - currentPassword
 *               - newPassword
 *             properties:
 *               currentPassword:
 *                 type: string
 *               newPassword:
 *                 type: string
 *     responses:
 *       200:
 *         description: 비밀번호 변경 성공
 *       400:
 *         description: 현재 비밀번호가 일치하지 않음
 *       401:
 *         description: 인증되지 않음
 */
router.post('/change-password', authenticate, changePassword);

export default router;
