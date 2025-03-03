import mongoose from 'mongoose';
import dotenv from 'dotenv';

// 환경 변수 설정
dotenv.config();

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI || '');
    console.log(`MongoDB 연결 성공: ${conn.connection.host}`);
  } catch (error: any) {
    console.error(`MongoDB 연결 실패: ${error.message}`);
    process.exit(1);
  }
};

export default connectDB;
