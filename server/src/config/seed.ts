import User, { UserRole } from '../models/User';
import { logger } from '../utils/logger';

export const seedAdminUser = async () => {
  try {
    // 관리자 계정이 이미 존재하는지 확인
    const adminExists = await User.findOne({ email: 'admin@example.com' });
    
    if (!adminExists) {
      // 관리자 계정 생성
      await User.create({
        username: 'admin',
        email: 'admin@example.com',
        password: 'admin123', // 실제 환경에서는 더 강력한 비밀번호 사용
        firstName: '관리자',
        lastName: '계정',
        role: UserRole.ADMIN,
      });
      
      logger.info('관리자 계정이 생성되었습니다.');
    }
  } catch (error) {
    logger.error('관리자 계정 생성 중 오류 발생:', error);
  }
}; 