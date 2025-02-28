import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import swaggerUi from 'swagger-ui-express';
import swaggerJsDoc from 'swagger-jsdoc';
import { logger } from './utils/logger';

// 라우터 가져오기
import userRoutes from './routes/userRoutes';
import adminRoutes from './routes/adminRoutes';
import adminClubRoutes from './routes/adminClubRoutes';
import clubRoutes from './routes/clubRoutes';
import clubOwnerRoutes from './routes/clubOwnerRoutes';
import boardRoutes from './routes/boardRoutes';
import postRoutes from './routes/postRoutes';

const app = express();

// CORS 설정
const corsOptions = {
  origin: process.env.NODE_ENV === 'production' ? 'https://pylon-app.com' : '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  credentials: true,
};

app.use(cors(corsOptions));
app.use(express.json());
app.use(helmet());
app.use(
  morgan('dev', {
    stream: { write: (message) => logger.debug(message.trim()) },
  })
);

// Swagger 설정
const swaggerOptions = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: '동아리 플랫폼 API',
      version: '1.0.0',
      description: '동아리 관리 및 활동을 위한 REST API',
    },
    servers: [
      {
        url:
          process.env.NODE_ENV === 'production'
            ? 'https://pylon-app.com'
            : 'http://localhost:5000',
        description: '개발 서버',
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        },
      },
    },
  },
  apis: ['./src/routes/*.ts'],
};

const swaggerDocs = swaggerJsDoc(swaggerOptions);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs));

// 라우터 등록
app.use('/api/user', userRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/admin', adminClubRoutes);
app.use('/api/clubs', clubRoutes);
app.use('/api/clubs', clubOwnerRoutes);

// 게시판 및 게시글 라우터 등록 (중첩 라우팅)
app.use('/api/clubs/:clubId/boards', boardRoutes);
app.use('/api/clubs/:clubId/boards/:boardId/posts', postRoutes);

// 기본 라우트
app.get('/', (req, res) => {
  res.send('동아리 플랫폼 API 서버에 오신 것을 환영합니다.');
});

export default app;
