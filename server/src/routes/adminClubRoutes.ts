import express from 'express';
import {
  getAllClubs,
  getClubById,
  createClub,
  updateClub,
  deleteClub,
  getClubMembers,
  updateMemberStatus,
} from '../controllers/adminClubController';
import { authenticate, isAdmin } from '../middlewares/auth';

const router = express.Router();

// 모든 라우트에 인증 및 관리자 권한 검사 미들웨어 적용
router.use(authenticate, isAdmin);

/**
 * @swagger
 * tags:
 *   - name: 관리자/동아리
 *     description: 시스템 관리자용 동아리 관리 API
 */

/**
 * @swagger
 * /api/admin/clubs:
 *   get:
 *     summary: 모든 동아리 조회
 *     description: 시스템 관리자가 모든 동아리 정보를 조회합니다.
 *     tags: [관리자/동아리]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: 동아리 목록 반환
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 clubs:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       name:
 *                         type: string
 *                       description:
 *                         type: string
 *                       category:
 *                         type: string
 *                       imageUrl:
 *                         type: string
 *                       owner:
 *                         type: object
 *                         properties:
 *                           username:
 *                             type: string
 *                           email:
 *                             type: string
 *                       members:
 *                         type: array
 *                         items:
 *                           type: object
 *                           properties:
 *                             user:
 *                               type: object
 *                               properties:
 *                                 username:
 *                                   type: string
 *                                 email:
 *                                   type: string
 *                             role:
 *                               type: string
 *                               enum: [owner, admin, member, pending]
 *                             joinedAt:
 *                               type: string
 *                               format: date-time
 *             examples:
 *               example1:
 *                 value:
 *                   clubs:
 *                     - name: "Coding Club"
 *                       description: "A club for coding enthusiasts"
 *                       category: "Technology"
 *                       imageUrl: "http://example.com/image.png"
 *                       owner:
 *                         username: "admin"
 *                         email: "admin@example.com"
 *                       members:
 *                         - user:
 *                             username: "member1"
 *                             email: "member1@example.com"
 *                           role: "member"
 *                           joinedAt: "2023-10-01T12:00:00Z"
 *       401:
 *         description: 인증되지 않음
 *         content:
 *           application/json:
 *             examples:
 *               example1:
 *                 value:
 *                   message: "인증이 필요합니다."
 *       403:
 *         description: 관리자 권한 없음
 *         content:
 *           application/json:
 *             examples:
 *               example1:
 *                 value:
 *                   message: "관리자 권한이 필요합니다."
 */
router.get('/clubs', getAllClubs);

/**
 * @swagger
 * /api/admin/clubs/{id}:
 *   get:
 *     summary: 특정 동아리 조회
 *     description: 시스템 관리자가 특정 동아리의 상세 정보를 조회합니다.
 *     tags: [관리자/동아리]
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
 *         description: 동아리 정보 반환
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 club:
 *                   type: object
 *                   properties:
 *                     name:
 *                       type: string
 *                     description:
 *                       type: string
 *                     category:
 *                       type: string
 *                     imageUrl:
 *                       type: string
 *                     owner:
 *                       type: object
 *                       properties:
 *                         username:
 *                           type: string
 *                         email:
 *                           type: string
 *                     members:
 *                       type: array
 *                       items:
 *                         type: object
 *                         properties:
 *                           user:
 *                             type: object
 *                             properties:
 *                               username:
 *                                 type: string
 *                               email:
 *                                 type: string
 *                           role:
 *                             type: string
 *                             enum: [owner, admin, member, pending]
 *                           joinedAt:
 *                             type: string
 *                             format: date-time
 *             examples:
 *               example1:
 *                 value:
 *                   club:
 *                     name: "Coding Club"
 *                     description: "A club for coding enthusiasts"
 *                     category: "Technology"
 *                     imageUrl: "http://example.com/image.png"
 *                     owner:
 *                       username: "admin"
 *                       email: "admin@example.com"
 *                     members:
 *                       - user:
 *                           username: "member1"
 *                           email: "member1@example.com"
 *                         role: "member"
 *                         joinedAt: "2023-10-01T12:00:00Z"
 *       404:
 *         description: 동아리를 찾을 수 없음
 *         content:
 *           application/json:
 *             examples:
 *               example1:
 *                 value:
 *                   message: "동아리를 찾을 수 없습니다."
 */
router.get('/clubs/:id', getClubById);

/**
 * @swagger
 * /api/admin/clubs:
 *   post:
 *     summary: 동아리 생성
 *     description: 시스템 관리자가 새로운 동아리를 생성합니다. 동아리 생성 시 소유자를 지정해야 합니다.
 *     tags: [관리자/동아리]
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
 *               - description
 *               - category
 *               - ownerId
 *             properties:
 *               name:
 *                 type: string
 *               description:
 *                 type: string
 *               category:
 *                 type: string
 *               imageUrl:
 *                 type: string
 *               ownerId:
 *                 type: string
 *                 description: 동아리 소유자로 지정할 사용자 ID
 *               isPrivate:
 *                 type: boolean
 *                 default: true
 *                 description: 가입 승인이 필요한지 여부
 *     responses:
 *       201:
 *         description: 동아리 생성 성공
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 club:
 *                   type: object
 *                   properties:
 *                     name:
 *                       type: string
 *                     description:
 *                       type: string
 *                     category:
 *                       type: string
 *                     imageUrl:
 *                       type: string
 *                     owner:
 *                       type: string
 *                     isPrivate:
 *                       type: boolean
 *                     members:
 *                       type: array
 *                       items:
 *                         type: object
 *                         properties:
 *                           user:
 *                             type: string
 *                           role:
 *                             type: string
 *                             enum: [owner, admin, member, pending]
 *                           joinedAt:
 *                             type: string
 *                             format: date-time
 */
router.post('/clubs', createClub);

/**
 * @swagger
 * /api/admin/clubs/{id}:
 *   put:
 *     summary: 동아리 정보 수정
 *     description: 시스템 관리자가 모든 동아리 정보를 수정할 수 있습니다. 소유자 변경도 가능합니다.
 *     tags: [관리자/동아리]
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
 *               name:
 *                 type: string
 *               description:
 *                 type: string
 *               category:
 *                 type: string
 *               imageUrl:
 *                 type: string
 *               isActive:
 *                 type: boolean
 *                 description: 활성화 상태
 *               isPrivate:
 *                 type: boolean
 *                 description: 가입 승인 필요 여부
 *               ownerId:
 *                 type: string
 *                 description: 소유자 변경 시 새 소유자 ID
 *     responses:
 *       200:
 *         description: 동아리 정보 업데이트 성공
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 club:
 *                   type: object
 *                   properties:
 *                     name:
 *                       type: string
 *                     description:
 *                       type: string
 *                     category:
 *                       type: string
 *                     imageUrl:
 *                       type: string
 *                     owner:
 *                       type: string
 *                     isActive:
 *                       type: boolean
 *                     isPrivate:
 *                       type: boolean
 *                     members:
 *                       type: array
 *                       items:
 *                         type: object
 *                         properties:
 *                           user:
 *                             type: string
 *                           role:
 *                             type: string
 *                             enum: [owner, admin, member, pending]
 *                           joinedAt:
 *                             type: string
 *                             format: date-time
 */
router.put('/clubs/:id', updateClub);

/**
 * @swagger
 * /api/admin/clubs/{id}:
 *   delete:
 *     summary: 동아리 삭제
 *     description: 시스템 관리자가 동아리를 완전히 삭제합니다. 이 작업은 되돌릴 수 없습니다.
 *     tags: [관리자/동아리]
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
 *         description: 동아리 삭제 성공
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 */
router.delete('/clubs/:id', deleteClub);

/**
 * @swagger
 * /api/admin/clubs/{id}/members:
 *   get:
 *     summary: 동아리 회원 목록 조회
 *     description: 시스템 관리자가 특정 동아리의 모든 회원 정보를 조회합니다.
 *     tags: [관리자/동아리]
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
 *         description: 동아리 회원 목록 반환
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 members:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       user:
 *                         type: object
 *                         properties:
 *                           username:
 *                             type: string
 *                           email:
 *                             type: string
 *                           profileImage:
 *                             type: string
 *                       role:
 *                         type: string
 *                         enum: [owner, admin, member, pending]
 *                       joinedAt:
 *                         type: string
 *                         format: date-time
 *       404:
 *         description: 동아리를 찾을 수 없음
 */
router.get('/clubs/:id/members', getClubMembers);

/**
 * @swagger
 * /api/admin/clubs/{id}/members:
 *   post:
 *     summary: 동아리 회원 상태 변경
 *     description: 시스템 관리자가 동아리 회원의 상태를 변경합니다. 승인, 거부, 추방, 직접 추가 등의 작업이 가능합니다.
 *     tags: [관리자/동아리]
 *     parameters:
 *       - in: path
 *         name: id
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
 *               - userId
 *               - action
 *             properties:
 *               userId:
 *                 type: string
 *                 description: 작업 대상 사용자 ID
 *               action:
 *                 type: string
 *                 enum: [approve, reject, kick, add]
 *                 description: >
 *                   approve - 가입 승인,
 *                   reject - 가입 거부,
 *                   kick - 회원 추방,
 *                   add - 직접 회원 추가
 *     responses:
 *       200:
 *         description: 회원 상태 변경 성공
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 member:
 *                   type: object
 *                   properties:
 *                     user:
 *                       type: string
 *                     role:
 *                       type: string
 *                       enum: [owner, admin, member, pending]
 *                     joinedAt:
 *                       type: string
 *                       format: date-time
 *       400:
 *         description: 잘못된 요청
 *       404:
 *         description: 동아리를 찾을 수 없음
 */
router.post('/clubs/:id/members', updateMemberStatus);

export default router;
