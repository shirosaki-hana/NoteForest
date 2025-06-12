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
app.use('/auth', authRouter); // 인증 라우트
app.use('/api', requireAuth, apiRouter); // API 라우트
app.use(requireAuth, express.static(frontendDistPath)); // 정적 파일 서빙

app.get('/', requireAuth, (req: Request, res: Response) => {
  res.sendFile(path.join(frontendDistPath, 'index.html'));
});

// 서버 리스닝
app.listen(PORT, () => {

  writelog('server', `Server is running on http://127.0.0.1:${PORT}`);

});