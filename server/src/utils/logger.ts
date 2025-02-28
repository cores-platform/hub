import winston from 'winston';
import path from 'path';

// 로그 레벨 정의
const levels = {
  error: 0,
  warn: 1,
  info: 2,
  http: 3,
  debug: 4,
};

// 현재 환경에 따른 로그 레벨 선택
const level = () => {
  const env = process.env.NODE_ENV || 'development';
  const isDevelopment = env === 'development';
  return isDevelopment ? 'debug' : 'warn';
};

// 로그 색상 정의
const colors = {
  error: 'red',
  warn: 'yellow',
  info: 'green',
  http: 'magenta',
  debug: 'white',
};

winston.addColors(colors);

// 로그 포맷 정의
const format = winston.format.combine(
  winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss:ms' }),
  winston.format.colorize({ all: true }),
  winston.format.printf(
    (info) => `${info.timestamp} ${info.level}: ${info.message}`
  )
);

// 로그 저장 위치 정의
const transports = [
  // 콘솔에 출력
  new winston.transports.Console(),

  // 에러 로그는 파일에 저장
  new winston.transports.File({
    filename: path.join('logs', 'error.log'),
    level: 'error',
  }),

  // 모든 로그는 파일에 저장
  new winston.transports.File({ filename: path.join('logs', 'all.log') }),
];

// 로거 생성
export const logger = winston.createLogger({
  level: level(),
  levels,
  format,
  transports,
});

// 개발 환경에서는 더 자세한 로깅
if (process.env.NODE_ENV !== 'production') {
  logger.debug('로깅 시스템이 초기화되었습니다.');
}

export default logger;
