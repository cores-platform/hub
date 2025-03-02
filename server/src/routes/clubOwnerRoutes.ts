import express from 'express';
import {
  updateClub,
  transferOwnership,
  deleteClub,
  approveJoinRequest,
  rejectJoinRequest,
  kickMember,
  promoteToAdmin,
  demoteFromAdmin,
} from '../controllers/clubOwnerController';
import { authenticate } from '../middlewares/auth';
import { isClubOwner, isClubAdmin } from '../middlewares/clubAuth';

const router = express.Router();

/**
 * @swagger
 * tags:
 *   - name: 소유자/동아리
 *     description: 동아리 소유자 전용 관리 API
 *   - name: 관리자/동아리
 *     description: 동아리 관리자용 회원 관리 API
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     Club:
 *       type: object
 *       properties:
 *         name:
 *           type: string
 *         description:
 *           type: string
 *         category:
 *           type: string
 *         imageUrl:
 *           type: string
 *         owner:
 *           type: string
 *         members:
 *           type: array
 *           items:
 *             type: object
 *             properties:
 *               user:
 *                 type: string
 *               role:
 *                 type: string
 *                 enum: [owner, admin, member, pending]
 *               joinedAt:
 *                 type: string
 *                 format: date-time
 *         isActive:
 *           type: boolean
 *         isPrivate:
 *           type: boolean
 *         createdAt:
 *           type: string
 *           format: date-time
 *         updatedAt:
 *           type: string
 *           format: date-time
 */

/**
 * @swagger
 * /api/clubs/{id}:
 *   put:
 *     summary: 동아리 정보 수정
 *     description: 동아리 소유자가 자신의 동아리 정보를 수정합니다.
 *     tags: [소유자/동아리]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 description: 동아리 이름
 *               description:
 *                 type: string
 *                 description: 동아리 설명
 *               category:
 *                 type: string
 *                 description: 동아리 카테고리
 *               imageUrl:
 *                 type: string
 *                 description: 동아리 프로필 이미지 URL
 *               isPrivate:
 *                 type: boolean
 *                 description: 가입 승인 필요 여부 (true/false)
 *     responses:
 *       200:
 *         description: 동아리 정보 업데이트 성공
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 club:
 *                   $ref: '#/components/schemas/Club'
 *       400:
 *         description: 잘못된 요청 (이미 존재하는 동아리 이름)
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: '이미 존재하는 동아리 이름입니다.'
 *       403:
 *         description: 소유자 권한 없음
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: '동아리 소유자만 이 작업을 수행할 수 있습니다.'
 *       404:
 *         description: 동아리를 찾을 수 없음
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: '동아리를 찾을 수 없습니다.'
 *       500:
 *         description: 서버 오류
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: '동아리 업데이트 중 오류가 발생했습니다.'
 */
router.put('/:clubId', authenticate, isClubOwner, updateClub);

/**
 * @swagger
 * /api/clubs/{clubId}/transfer-ownership:
 *   post:
 *     summary: 동아리 소유권 이전
 *     description: 동아리 소유자가 다른 회원에게 소유권을 이전합니다. 기존 소유자는 관리자가 됩니다.
 *     tags: [소유자/동아리]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: clubId
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - userId
 *             properties:
 *               userId:
 *                 type: string
 *                 description: 새 소유자로 지정할 회원의 ID
 *     responses:
 *       200:
 *         description: 소유권 이전 성공
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: '동아리 소유권이 이전되었습니다.'
 *                 club:
 *                   $ref: '#/components/schemas/Club'
 *       400:
 *         description: 대상 사용자가 회원이 아님
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: '소유권을 이전할 대상이 동아리 회원이 아닙니다.'
 *       403:
 *         description: 소유자 권한 없음
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: '동아리 소유자만 이 작업을 수행할 수 있습니다.'
 *       404:
 *         description: 동아리를 찾을 수 없음
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: '동아리를 찾을 수 없습니다.'
 *       500:
 *         description: 서버 오류
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: '동아리 소유권 이전 중 오류가 발생했습니다.'
 */
router.post(
  '/:clubId/transfer-ownership',
  authenticate,
  isClubOwner,
  transferOwnership
);

/**
 * @swagger
 * /api/clubs/{clubId}:
 *   delete:
 *     summary: 동아리 삭제
 *     description: 동아리 소유자가 자신의 동아리를 삭제합니다. 이 작업은 되돌릴 수 없습니다.
 *     tags: [소유자/동아리]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: clubId
 *         required: true
 *         schema:
 *           type: string
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
 *                   example: '동아리가 삭제되었습니다.'
 *       403:
 *         description: 소유자 권한 없음
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: '동아리 소유자만 이 작업을 수행할 수 있습니다.'
 *       404:
 *         description: 동아리를 찾을 수 없음
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: '동아리를 찾을 수 없습니다.'
 *       500:
 *         description: 서버 오류
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: '동아리 삭제 중 오류가 발생했습니다.'
 */
router.delete('/:clubId', authenticate, isClubOwner, deleteClub);

/**
 * @swagger
 * /api/clubs/{clubId}/approve:
 *   post:
 *     summary: 회원 가입 승인
 *     description: 동아리 관리자가 가입 대기 중인 사용자의 가입을 승인합니다.
 *     tags: [관리자/동아리]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: clubId
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - userId
 *             properties:
 *               userId:
 *                 type: string
 *                 description: 승인할 사용자의 ID
 *     responses:
 *       200:
 *         description: 가입 승인 성공
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: '가입 신청이 승인되었습니다.'
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
 *         description: 가입 신청이 없음
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: '해당 사용자의 가입 신청이 없습니다.'
 *       403:
 *         description: 관리자 권한 없음
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: '동아리 관리자만 이 작업을 수행할 수 있습니다.'
 *       404:
 *         description: 동아리를 찾을 수 없음
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: '동아리를 찾을 수 없습니다.'
 *       500:
 *         description: 서버 오류
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: '가입 승인 중 오류가 발생했습니다.'
 */
router.post(
  '/:clubId/approve',
  authenticate,
  isClubAdmin,
  approveJoinRequest
);

/**
 * @swagger
 * /api/clubs/{clubId}/reject:
 *   post:
 *     summary: 회원 가입 거부
 *     description: 동아리 관리자가 가입 대기 중인 사용자의 가입을 거부합니다.
 *     tags: [관리자/동아리]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: clubId
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - userId
 *             properties:
 *               userId:
 *                 type: string
 *                 description: 거부할 사용자의 ID
 *     responses:
 *       200:
 *         description: 가입 거부 성공
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: '가입 신청이 거부되었습니다.'
 *       400:
 *         description: 가입 신청이 없음
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: '해당 사용자의 가입 신청이 없습니다.'
 *       403:
 *         description: 관리자 권한 없음
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: '동아리 관리자만 이 작업을 수행할 수 있습니다.'
 *       404:
 *         description: 동아리를 찾을 수 없음
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: '동아리를 찾을 수 없습니다.'
 *       500:
 *         description: 서버 오류
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: '가입 거부 중 오류가 발생했습니다.'
 */
router.post(
  '/:clubId/reject',
  authenticate,
  isClubAdmin,
  rejectJoinRequest
);

/**
 * @swagger
 * /api/clubs/{clubId}/kick:
 *   post:
 *     summary: 회원 추방
 *     description: 동아리 관리자가 회원을 추방합니다. 소유자는 추방할 수 없으며, 일반 관리자는 다른 관리자를 추방할 수 없습니다.
 *     tags: [관리자/동아리]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: clubId
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - userId
 *             properties:
 *               userId:
 *                 type: string
 *                 description: 추방할 회원의 ID
 *     responses:
 *       200:
 *         description: 회원 추방 성공
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: '회원이 추방되었습니다.'
 *       400:
 *         description: 회원이 아니거나 소유자는 추방 불가
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: '해당 사용자는 동아리 회원이 아닙니다.'
 *       403:
 *         description: 관리자 권한 없음 또는 다른 관리자 추방 불가
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: '관리자는 다른 관리자를 추방할 수 없습니다.'
 *       404:
 *         description: 동아리를 찾을 수 없음
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: '동아리를 찾을 수 없습니다.'
 *       500:
 *         description: 서버 오류
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: '회원 추방 중 오류가 발생했습니다.'
 */
router.post('/:clubId/kick', authenticate, isClubAdmin, kickMember);

/**
 * @swagger
 * /api/clubs/{clubId}/promote:
 *   post:
 *     summary: 일반 회원을 관리자로 승격
 *     description: 동아리 소유자가 일반 회원을 관리자로 승격시킵니다.
 *     tags: [소유자/동아리]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: clubId
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - userId
 *             properties:
 *               userId:
 *                 type: string
 *                 description: 관리자로 승격시킬 회원의 ID
 *     responses:
 *       200:
 *         description: 관리자 승격 성공
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: '관리자로 임명되었습니다.'
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
 *         description: 일반 회원이 아님
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: '해당 사용자는 동아리 회원이 아니거나 이미 관리자입니다.'
 *       403:
 *         description: 소유자 권한 없음
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: '동아리 소유자만 이 작업을 수행할 수 있습니다.'
 *       404:
 *         description: 동아리를 찾을 수 없음
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: '동아리를 찾을 수 없습니다.'
 *       500:
 *         description: 서버 오류
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: '관리자 임명 중 오류가 발생했습니다.'
 */
router.post('/:clubId/promote', authenticate, isClubOwner, promoteToAdmin);

/**
 * @swagger
 * /api/clubs/{clubId}/demote:
 *   post:
 *     summary: 관리자를 일반 회원으로 강등
 *     description: 동아리 소유자가 관리자를 일반 회원으로 강등시킵니다.
 *     tags: [소유자/동아리]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: clubId
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - userId
 *             properties:
 *               userId:
 *                 type: string
 *                 description: 일반 회원으로 강등시킬 관리자의 ID
 *     responses:
 *       200:
 *         description: 관리자 강등 성공
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: '관리자에서 해임되었습니다.'
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
 *         description: 관리자가 아님
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: '해당 사용자는 관리자가 아닙니다.'
 *       403:
 *         description: 소유자 권한 없음
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: '동아리 소유자만 이 작업을 수행할 수 있습니다.'
 *       404:
 *         description: 동아리를 찾을 수 없음
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: '동아리를 찾을 수 없습니다.'
 *       500:
 *         description: 서버 오류
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: '관리자 해임 중 오류가 발생했습니다.'
 */
router.post('/:clubId/demote', authenticate, isClubOwner, demoteFromAdmin);

export default router;
