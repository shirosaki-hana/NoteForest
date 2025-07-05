import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import cookieParser from 'cookie-parser';
import { requireAuth, authRouter } from './lib/auth';
import { apiRouter } from './lib/api';
import { writelog } from './lib/log';
import { Request, Response } from 'express';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;
const frontendDistPath = path.join(__dirname, '../../frontend/dist');

app.use(cors()); //TODO : 환경변수로 프로덕트/데브모드 구분하고 운영 도메인 입력받아서 CORS제한하도록 보안 강화 필요)
app.use(express.json());
app.use(cookieParser());

// 인증 API 라우트 (JSON 응답)
app.use('/auth', authRouter);

// API 라우트 (인증 필요)
app.use('/api', requireAuth, apiRouter);

// 정적 파일 서빙 (인증 불필요) - PWA 지원을 위해
app.use(express.static(frontendDistPath));

// 루트 경로는 명시적으로 처리
app.get('/', (req: Request, res: Response) => {
  res.sendFile(path.join(frontendDistPath, 'index.html'));
});

// 서버 리스닝
app.listen(PORT, () => {
  writelog('server', `Server is running on http://127.0.0.1:${PORT}`);
});