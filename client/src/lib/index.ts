// 모듈 별칭으로 내보내기
import * as ApiBase from './api';
import * as ApiAuth from './api-auth';
import * as ApiUser from './api-user';
import * as ApiClub from './api-club';
import * as ApiBoard from './api-board';

// 모듈들을 각각의 네임스페이스로 내보내기
export { ApiBase, ApiAuth, ApiUser, ApiClub, ApiBoard };

// 편의를 위해 자주 사용하는 함수들은 직접 내보내기
export const { api, isAuthenticated } = ApiBase;
