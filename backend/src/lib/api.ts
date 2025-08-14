import path from 'path';
import fs from 'fs/promises';
import { Router, Request, Response } from 'express';
import matter from 'gray-matter';
import { logger } from './log';

const DATABASE_DIR = path.join(__dirname, '../../database');
const apiRouter = Router();

// Helper function to validate UUID
const isValidUUID = (uuid: string): boolean => {
  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
  return uuidRegex.test(uuid);
};

// Helper function to get file path
const getFilePath = (uuid: string): string => {
  return path.join(DATABASE_DIR, `${uuid}.md`);
};

// database 디렉터리가 없으면 생성
(async () => {
  try {
    await fs.access(DATABASE_DIR);
  } catch {
    await fs.mkdir(DATABASE_DIR, { recursive: true });
  }
})();

// 메모 작성/수정 API
apiRouter.post('/write', async (req: Request, res: Response): Promise<void> => {
  try {
    const { uuid, title, tags, createdAt, body } = req.body; // id -> uuid
    // 필수 필드 검증
    if (!uuid || !title || !body) {
      res.status(400).json({
        success: false,
        error: 'uuid, title, body는 필수 필드입니다.', // id -> uuid
      });
      return;
    }

    // UUID 형식 검증
    if (!isValidUUID(uuid)) {
      res.status(400).json({
        success: false,
        error: '유효하지 않은 UUID 형식입니다.',
      });
      return;
    }

    const now = new Date().toISOString();
    // gray-matter를 사용한 front-matter 생성
    const fileContent = matter.stringify(body, {
      title,
      createdAt: createdAt || now, // createdAt은 요청 시 없으면 현재 시간, 있으면 해당 값 사용
      updatedAt: now, // updatedAt은 항상 현재 시간으로 갱신
      tags: Array.isArray(tags) ? tags : [],
    });

    // 파일 경로 생성
    const filePath = getFilePath(uuid);
    // 파일 쓰기
    await fs.writeFile(filePath, fileContent, 'utf-8');

    res.json({
      success: true,
      message: '메모가 성공적으로 저장되었습니다.',
      uuid, // fileId -> uuid
    });
  } catch (error) {
    logger.error('메모 저장 오류:', error);
    res.status(500).json({
      success: false,
      error: '메모 저장 중 오류가 발생했습니다.',
    });
  }
});

// 메모 읽기 API
apiRouter.get('/read/:uuid', async (req: Request, res: Response): Promise<void> => {
  try {
    const { uuid } = req.params;

    // UUID 형식 검증
    if (!isValidUUID(uuid)) {
      res.status(400).json({
        success: false,
        error: '유효하지 않은 UUID 형식입니다.',
      });
      return;
    }

    // 파일 경로 생성
    const filePath = getFilePath(uuid);

    // 파일 존재 확인 및 읽기
    try {
      await fs.access(filePath);
    } catch {
      res.status(404).json({
        success: false,
        error: '요청한 메모를 찾을 수 없습니다.',
      });
      return;
    }
    const fileContent = await fs.readFile(filePath, 'utf-8');

    // gray-matter를 사용한 YAML front-matter 파싱
    const { data: metadata, content: body } = matter(fileContent);

    res.json({
      success: true,
      data: {
        uuid, // id -> uuid
        title: metadata.title || '',
        tags: metadata.tags || [],
        createdAt: metadata.createdAt || '',
        updatedAt: metadata.updatedAt || '',
        body: body.trim(),
      },
    });
  } catch (error) {
    logger.error('메모 읽기 오류:', error);
    res.status(500).json({
      success: false,
      error: '메모를 읽는 중 오류가 발생했습니다.',
    });
  }
});

// 메모 목록 조회 API
// Todo:  이 API는 데이터베이스 디렉터리의 모든 .md 파일을 조회하여 메모 목록을 반환합니다.
//        파일 시스템 오버헤드가 우려스러우므로, 차후 캐싱구현 또는 데이터베이스로 전환하는 것을 고려할 수 있습니다.
apiRouter.get('/list', async (req: Request, res: Response): Promise<void> => {
  try {
    // database 디렉터리의 모든 .md 파일 조회
    const files = await fs.readdir(DATABASE_DIR);
    const mdFiles = files.filter(file => file.endsWith('.md'));

    const memoList = [];

    for (const file of mdFiles) {
      try {
        // UUID 추출 (파일명에서 .md 제거)
        const uuid = file.replace('.md', ''); // id -> uuid

        // UUID 형식 검증
        if (!isValidUUID(uuid)) {
          logger.warn(`Skipping file with invalid UUID format: ${file}`);
          continue; // UUID 형식이 아닌 파일은 건너뛰기
        }

        const filePath = getFilePath(uuid);
        const fileContent = await fs.readFile(filePath, 'utf-8');

        // gray-matter를 사용한 YAML front-matter 파싱
        const { data: metadata } = matter(fileContent);

        memoList.push({
          uuid, // id -> uuid
          title: metadata.title || '',
          tags: metadata.tags || [],
          createdAt: metadata.createdAt || '',
          updatedAt: metadata.updatedAt || '',
        });
      } catch (error) {
        logger.error(`파일 ${file} 처리 중 오류:`, error);
        // 개별 파일 오류는 건너뛰고 계속 진행
        continue;
      }
    }

    // 최신 업데이트 순으로 정렬 (updatedAt 기준 내림차순)
    memoList.sort((a, b) => {
      const dateA = new Date(a.updatedAt);
      const dateB = new Date(b.updatedAt);
      // 유효하지 않은 날짜 문자열에 대한 방어 코드 추가
      if (isNaN(dateA.getTime()) || isNaN(dateB.getTime())) {
        // 유효하지 않은 날짜가 있는 경우 정렬 순서에 영향을 주지 않도록 처리
        // 혹은 특정 기본값으로 처리하거나 오류 로깅 후 해당 항목을 제외할 수도 있음
        return 0;
      }
      return dateB.getTime() - dateA.getTime();
    });

    res.json({
      success: true,
      data: memoList,
      count: memoList.length,
    });
  } catch (error) {
    logger.error('메모 목록 조회 오류:', error);
    res.status(500).json({
      success: false,
      error: '메모 목록을 조회하는 중 오류가 발생했습니다.',
    });
  }
});

// 메모 삭제 API
apiRouter.delete('/:uuid', async (req: Request, res: Response): Promise<void> => {
  try {
    const { uuid } = req.params;

    // UUID 형식 검증
    if (!isValidUUID(uuid)) {
      res.status(400).json({
        success: false,
        error: '유효하지 않은 UUID 형식입니다.',
      });
      return;
    }

    // 파일 경로 생성
    const filePath = getFilePath(uuid);

    // 파일 존재 확인
    try {
      await fs.access(filePath);
    } catch {
      res.status(404).json({
        success: false,
        error: '삭제하려는 메모를 찾을 수 없습니다.',
      });
      return;
    }

    // 파일 삭제
    await fs.unlink(filePath);

    res.json({
      success: true,
      message: '메모가 성공적으로 삭제되었습니다.',
      deletedUuid: uuid, // deletedId -> deletedUuid
    });
  } catch (error) {
    logger.error('메모 삭제 오류:', error);
    res.status(500).json({
      success: false,
      error: '메모를 삭제하는 중 오류가 발생했습니다.',
    });
  }
});

export { apiRouter };
