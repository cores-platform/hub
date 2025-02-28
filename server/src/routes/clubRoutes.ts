import express from 'express';
import {
  getAllClubs,
  getClubById,
  joinClub,
  leaveClub,
} from '../controllers/clubController';
import { authenticate } from '../middlewares/auth';

const router = express.Router();

/**
 * @swagger
 * tags:
 *   - name: 일반/동아리
 *     description: 일반 사용자용 동아리 조회 및 가입 API
 */

/**
 * @swagger
 * /api/clubs:
 *   get:
 *     summary: 모든 동아리 조회
 *     description: 사용자가 활성화된 모든 동아리를 조회합니다. 검색 및 필터링 기능을 제공합니다.
 *     tags: [일반/동아리]
 *     parameters:
 *       - in: query
 *         name: category
 *         schema:
 *           type: string
 *         description: 카테고리별 필터링
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *         description: 동아리 이름 또는 설명 검색
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
 *     responses:
 *       200:
 *         description: 동아리 목록 반환
 */
router.get('/', getAllClubs);

/**
 * @swagger
 * /api/clubs/{id}:
 *   get:
 *     summary: 특정 동아리 조회
 *     description: 사용자가 특정 동아리의 기본 정보를 조회합니다. 회원 수, 카테고리 등의 정보가 포함됩니다.
 *     tags: [일반/동아리]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: 동아리 정보 반환
 *       404:
 *         description: 동아리를 찾을 수 없음
 */
router.get('/:id', getClubById);

/**
 * @swagger
 * /api/clubs/{id}/join:
 *   post:
 *     summary: 동아리 가입 신청
 *     description: 사용자가 동아리 가입을 신청합니다. 비공개 동아리는 승인 절차가 필요하고, 공개 동아리는 바로 가입됩니다.
 *     tags: [일반/동아리]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: 가입 신청 완료
 *       400:
 *         description: 이미 회원이거나 가입 신청 중
 *       404:
 *         description: 동아리를 찾을 수 없음
 */
router.post('/:id/join', authenticate, joinClub);

/**
 * @swagger
 * /api/clubs/{id}/leave:
 *   post:
 *     summary: 동아리 탈퇴
 *     description: 사용자가 동아리에서 탈퇴합니다. 소유자는 탈퇴할 수 없습니다.
 *     tags: [일반/동아리]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: 탈퇴 완료
 *       400:
 *         description: 회원이 아니거나 소유자는 탈퇴 불가
 *       404:
 *         description: 동아리를 찾을 수 없음
 */
router.post('/:id/leave', authenticate, leaveClub);

export default router;
