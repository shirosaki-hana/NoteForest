import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import cookieParser from 'cookie-parser';
import compression from 'compression';
import helmet from 'helmet';
import { requireAuth, authRouter } from './lib/auth';
import { apiRouter } from './lib/api';
import { logger } from './lib/log';
import { Request, Response } from 'express';

dotenv.config({ quiet: true });

const app = express();
const PORT = process.env.PORT || 3001;
const frontendDistPath = path.join(__dirname, '../../frontend/dist');
const isDevelopment = process.env.NODE_ENV === 'development';

if (!isDevelopment) {
  app.set('trust proxy', 1);
  app.use(helmet());
}
app.use(compression());
app.use(cors({ origin: isDevelopment ? true : process.env.FRONTEND_URL, credentials: true }));
app.use(express.json({ limit: '50mb' })); // 50MB까지 허용
app.use(express.urlencoded({ extended: true, limit: '50mb' })); // URL 인코딩된 데이터도 50MB까지
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
  logger.info(`Environment: ${process.env.NODE_ENV || 'development'}`);
  logger.info(`Frontend static files served from: ${frontendDistPath}`);
  logger.success(`Server is running on http://127.0.0.1:${PORT}`);
});
