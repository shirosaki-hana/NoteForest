import path from 'path';
import fs from 'fs';
import { Router, Request, Response } from 'express';

const DATABASE_DIR = path.join(__dirname, '../database');
const apiRouter = Router();

// database 디렉터리가 없으면 생성
if (!fs.existsSync(DATABASE_DIR)) {
  fs.mkdirSync(DATABASE_DIR, { recursive: true });
}

interface NoteFile {
  filename: string;
  name: string;
  path: string;
  lastModified: Date;
}

// GET /api/list - 모든 .md 파일 리스트 반환
apiRouter.get('/list', (req: Request, res: Response) => {
  try {
    // database 디렉터리의 모든 파일 읽기
    const files = fs.readdirSync(DATABASE_DIR);
    
    // .md 파일만 필터링하고 정보 수집
    const mdFiles: NoteFile[] = files
      .filter(file => file.endsWith('.md'))
      .map(file => {
        const filePath = path.join(DATABASE_DIR, file);
        const stats = fs.statSync(filePath);
        
        return {
          filename: file,
          name: file.replace('.md', ''), // 확장자 제거한 이름
          path: filePath,
          lastModified: stats.mtime
        };
      })
      .sort((a, b) => b.lastModified.getTime() - a.lastModified.getTime()); // 최근 수정 순 정렬

    res.json({
      success: true,
      data: mdFiles,
      count: mdFiles.length
    });
  } catch (error) {
    console.error('Error reading markdown files:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to read markdown files',
      message: error instanceof Error ? error.message : 'Unknown error'
    });  }
});

export { apiRouter };
