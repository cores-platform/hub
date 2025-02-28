import dotenv from 'dotenv';
import { createServer } from 'http';
import { Server } from 'socket.io';
import connectDB from './config/db';
import app from './app';
import { seedAdminUser } from './config/seed';

// 환경 변수 설정
dotenv.config();

// MongoDB 연결
connectDB().then(() => {
  seedAdminUser();
});

// HTTP 서버 및 Socket.IO 설정
const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
  },
});

io.on('connection', (socket) => {
  console.log('사용자가 연결되었습니다:', socket.id);

  socket.on('disconnect', () => {
    console.log('사용자 연결 해제:', socket.id);
  });
});

// 서버 시작
const PORT = process.env.PORT || 5000;
httpServer.listen(PORT, () => {
  console.log(`서버가 포트 ${PORT}에서 실행 중입니다`);
});
