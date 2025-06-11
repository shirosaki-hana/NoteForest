import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import fs from 'fs';
import cookieParser from 'cookie-parser';
import { requireAuth, authRouter } from './auth';
import { Request, Response } from 'express';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;
const frontendDistPath = path.join(__dirname, '../../frontend/dist');
const databasePath = path.join(__dirname, '../database');

// 데이터베이스 디렉터리 확인 및 생성
if (!fs.existsSync(databasePath)) {
  fs.mkdirSync(databasePath, { recursive: true });
  console.log('Database directory created:', databasePath);
}

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

// /api/list 엔드포인트 - 모든 .md 파일 목록 반환
app.get('/api/list', (req: Request, res: Response) => {
  try {
    // .md 파일만 필터링
    const files = fs.readdirSync(databasePath)
      .filter(file => file.endsWith('.md'))
      .map(file => {
        const filePath = path.join(databasePath, file);
        const stats = fs.statSync(filePath);
        return {
          name: file,
          fileName: path.parse(file).name, // 확장자 제외한 파일명
          size: stats.size,
          created: stats.birthtime,
          modified: stats.mtime
        };
      })
      .sort((a, b) => b.modified.getTime() - a.modified.getTime()); // 최근 수정순 정렬

    res.json({
      success: true,
      files: files,
      count: files.length
    });
  } catch (error) {
    console.error('Error reading database directory:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to read notes directory',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

// 서버 리스닝
app.listen(PORT, () => {
  console.log(`Server is running on http://127.0.0.1:${PORT}`);
});