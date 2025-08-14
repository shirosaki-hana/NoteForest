import path from 'path';
import fs from 'fs/promises';
import bcrypt from 'bcrypt';
import { v4 as uuidv4 } from 'uuid';
import { Router, Request, Response, NextFunction } from 'express';
import { logger } from './log';
//import rateLimit from 'express-rate-limit';

const SAVE_DIR = path.join(__dirname, '../../auth');
const PASSWORD_FILE = path.join(SAVE_DIR, 'password.hash');
const SESSION_FILE = path.join(SAVE_DIR, 'sessions.json');
const SESSION_COOKIE = 'nf_session';
const SESSION_TTL = 1000 * 60 * 60 * 24; // 24시간

(async () => {
  try {
    await fs.access(SAVE_DIR);
  } catch {
    await fs.mkdir(SAVE_DIR, { recursive: true });
  }
})();

// 세션 관리 (메모리 + 파일)
let sessions: Record<string, number> = {};
// 세션 파일 로드 로직을 비동기 IIFE로 변경
(async () => {
  try {
    await fs.access(SESSION_FILE);
    const sessionData = await fs.readFile(SESSION_FILE, 'utf-8');
    sessions = JSON.parse(sessionData);
  } catch {
    // 파일이 없거나 읽기 오류 시, 빈 세션으로 시작
  }
})();

async function saveSessions() {
  // async 추가
  try {
    await fs.writeFile(SESSION_FILE, JSON.stringify(sessions)); // fs.writeFile 사용
  } catch (error) {
    logger.error('세션 파일 저장 실패:', error);
  }
}

function createSession() {
  const token = uuidv4();
  sessions[token] = Date.now() + SESSION_TTL;
  saveSessions();
  return token;
}

async function isValidSession(token: string | undefined): Promise<boolean> {
  if (!token) {
    return false;
  }
  const exp = sessions[token];
  if (!exp || exp < Date.now()) {
    delete sessions[token];
    await saveSessions();
    return false;
  }
  return true;
}

function removeSession(token: string) {
  delete sessions[token];
  saveSessions();
}

// 인증 미들웨어 (API용)
export async function requireAuth(req: Request, res: Response, next: NextFunction) {
  const token = req.cookies[SESSION_COOKIE];
  if (await isValidSession(token)) {
    return next();
  }
  res.status(401).json({ error: 'Unauthorized' });
}

/* 브루트포스 공격 방어용 Rate Limit
const limiter = rateLimit({
  windowMs: 900000, // 15분
  max: 5, // 최대 5회 시도
  standardHeaders: true, // 표준 헤더 반환 (`RateLimitLimit`, `RateLimitRemaining`, etc.)
  legacyHeaders: false, // `X-RateLimit-*` 헤더 비활성화
  keyGenerator: req => {
    // trust proxy 설정과 함께 안전한 IP 추출
    return req.ip || req.socket.remoteAddress || 'unknown';
  },
  handler: (req, res) => {
    res.status(429).json({ error: '너무 많이 시도 했어요.' });
  },
});*/

// 인증 API 라우트
export const authRouter = Router();

// 인증 상태 확인
authRouter.get('/check', async (req: Request, res: Response) => {
  const token = req.cookies[SESSION_COOKIE];
  const isValid = await isValidSession(token);

  if (isValid) {
    res.json({ authenticated: true });
  } else {
    res.status(401).json({ authenticated: false });
  }
});

// 비밀번호 설정 상태 확인
authRouter.get('/status', async (req: Request, res: Response) => {
  try {
    await fs.access(PASSWORD_FILE);
    res.json({ passwordSet: true });
  } catch {
    res.json({ passwordSet: false });
  }
});

// 비밀번호 설정
authRouter.post('/setup', /*limiter,*/ async (req: Request, res: Response) => {
  const clientIP =
    req.headers['x-forwarded-for'] || req.ip || req.socket.remoteAddress || 'Unknown IP';

  try {
    await fs.access(PASSWORD_FILE);
    res.status(400).json({ error: '비밀번호가 이미 설정되어 있어요.' });
    return;
  } catch {
    // 파일이 없으면 비밀번호 설정 진행
  }

  const { password } = req.body;

  if (!password || password.length < 8) {
    res.status(400).json({ error: '비밀번호는 8자 이상이어야 해요.' });
    return;
  }

  try {
    logger.log(`Password set attempt from : ${clientIP}`);
    const hash = await bcrypt.hash(password, 10);
    await fs.writeFile(PASSWORD_FILE, hash);
    const token = createSession();
    res.cookie(SESSION_COOKIE, token, { httpOnly: true });
    res.json({ success: true });

    logger.success(`Password setup success from : ${clientIP}`);
    logger.log(`Session created: ${token} for IP: ${clientIP}`);
  } catch (e) {
    logger.error('Password set error:', e);
    res.status(500).json({ error: '오류가 발생했어요.' });
  }
});

// 로그인
authRouter.post('/login', /*limiter,*/ async (req: Request, res: Response) => {
  const clientIP =
    req.headers['x-forwarded-for'] || req.ip || req.socket.remoteAddress || 'Unknown IP';

  logger.log(`Login attempt from : ${clientIP}`);

  try {
    await fs.access(PASSWORD_FILE);
  } catch {
    res.status(400).json({ error: '비밀번호가 설정되지 않았어요.' });
    return;
  }

  try {
    const { password } = req.body;

    if (!password) {
      logger.warn(`Login fail(password empty) from : ${clientIP}`);
      res.status(400).json({ error: '비밀번호를 입력해주세요.' });
      return;
    }

    const hash = await fs.readFile(PASSWORD_FILE, 'utf-8');
    const ok = await bcrypt.compare(password, hash);

    if (!ok) {
      logger.warn(`Login fail(wrong password) from : ${clientIP}`);
      res.status(401).json({ error: '비밀번호가 틀렸어요.' });
      return;
    }

    logger.success(`Login success from : ${clientIP}`);

    const token = createSession();
    logger.log(`Session created: ${token} for IP: ${clientIP}`);

    res.cookie(SESSION_COOKIE, token, { httpOnly: true });
    res.json({ success: true });
  } catch (e) {
    logger.error('Login error:', e);
    res.status(500).json({ error: '로그인 처리 중 오류가 발생했어요.' });
  }
});

// 로그아웃
authRouter.post('/logout', /*limiter,*/ async (req: Request, res: Response) => {
  const token = req.cookies[SESSION_COOKIE];
  if (token) {
    removeSession(token);
  }
  res.clearCookie(SESSION_COOKIE);
  res.json({ success: true });
});
