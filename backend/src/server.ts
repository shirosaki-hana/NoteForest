import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import cookieParser from 'cookie-parser';
import { requireAuth, authRouter } from './auth';
import { Request, Response } from 'express';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;
const frontendDistPath = path.join(__dirname, '../../frontend/dist');

// 미들웨어
app.use(cors());
app.use(express.json());
app.use(cookieParser());

// 인증 라우트
app.use('/auth', authRouter);

// 정적 파일 및 루트 라우트 인증 적용
app.use(requireAuth, express.static(frontendDistPath));

app.get('/', requireAuth, (req: Request, res: Response) => {
  res.sendFile(path.join(frontendDistPath, 'index.html'));
});

// API 라우트 인증 적용 예시
app.use('/api', requireAuth);

// 서버 리스닝
app.listen(PORT, () => {
  console.log(`Server is running on http://127.0.0.1:${PORT}`);
  console.log(`Frontend served from: ${frontendDistPath}`);
});