import path from 'path';
import fs from 'fs/promises';
import bcrypt from 'bcrypt';
import { v4 as uuidv4 } from 'uuid';
import { Router, Request, Response, NextFunction } from 'express';
import { writelog } from './log';

const SAVE_DIR = path.join(__dirname, '../../auth');
const PASSWORD_FILE = path.join(SAVE_DIR, 'password.hash');
const SESSION_FILE = path.join(SAVE_DIR, 'sessions.json');
const TEMPLATES_DIR = path.join(__dirname, '../../templates');
const SESSION_COOKIE = 'nf_session';
const SESSION_TTL = 1000 * 60 * 60 * 24; // 24시간

(async () => {
  try {
    await fs.access(SAVE_DIR);
  } catch {
    await fs.mkdir(SAVE_DIR, { recursive: true });
  }
})();

async function loadTemplate(templateName: string): Promise<string> { 
  try {
    const templatePath = path.join(TEMPLATES_DIR, templateName);
    return await fs.readFile(templatePath, 'utf-8'); 
  } catch {
    return '<h1>페이지를 불러올 수 없습니다.</h1>';
  }
}

function renderError(message: string): string {
  return `<h1>오류</h1><p>${message}</p>`;
}

async function renderLoginWithError(errorMessage: string): Promise<string> { 
  const template = await loadTemplate('login.html'); 
  // 에러 메시지를 포함한 로그인 폼 반환
  return template.replace(
    '<h2><span class="security-icon">🔑</span>로그인</h2>',
    `<h2><span class="security-icon">🔑</span>로그인</h2>
    <div class="error-message">
      <strong>⚠️ 오류</strong>
      ${errorMessage}
    </div>`
  );
}

async function renderPasswordSetupWithError(errorMessage: string): Promise<string> { 
  const template = await loadTemplate('password-setup.html'); 
  // 에러 메시지를 포함한 비밀번호 설정 폼 반환
  return template.replace(
    '<h2><span class="security-icon">🔐</span>비밀번호 설정</h2>',
    `<h2><span class="security-icon">🔐</span>비밀번호 설정</h2>
    <div class="error-message">
      <strong>⚠️ 오류</strong>
      ${errorMessage}
    </div>`
  );
}

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

async function saveSessions() { // async 추가
  try {
    await fs.writeFile(SESSION_FILE, JSON.stringify(sessions)); // fs.writeFile 사용
  } catch (error) {
    console.error('세션 파일 저장 실패:', error);
  }
}

function createSession() {
  const token = uuidv4();
  sessions[token] = Date.now() + SESSION_TTL;
  saveSessions(); 
  return token;
}

async function isValidSession(token: string | undefined): Promise<boolean> { 
  if (!token) return false;
  const exp = sessions[token];
  if (!exp || exp < Date.now()) {
    delete sessions[token];
    await saveSessions(); 
    return false;
  }
  return true;
}

// 인증 미들웨어
export async function requireAuth(req: Request, res: Response, next: NextFunction) { 
  const token = req.cookies[SESSION_COOKIE];
  if (await isValidSession(token)) return next(); 
  res.redirect('/auth');
}

// 인증/비밀번호 설정 라우트
export const authRouter = Router();
authRouter.get('/', async (req: Request, res: Response) => { 

    const clientIP = req.headers['x-forwarded-for'] || req.ip || req.socket.remoteAddress || 'Unknown IP';
    writelog('Server', `Connection from: ${clientIP}`);

  try {
    await fs.access(PASSWORD_FILE); 
    const template = await loadTemplate('login.html'); 
    res.send(template);
  } catch {
    // PASSWORD_FILE이 없으면 설정 페이지로
    const template = await loadTemplate('password-setup.html'); 
    res.send(template);
  }
});

authRouter.use(require('express').urlencoded({ extended: true }));
authRouter.post('/set', async (req: Request, res: Response) => {

  const clientIP = req.headers['x-forwarded-for'] || req.ip || req.socket.remoteAddress || 'Unknown IP';

  try {
    await fs.access(PASSWORD_FILE); 
    // 파일이 존재하면 이미 설정된 것이므로 리다이렉트
    res.redirect('/auth');
    return;
  } catch {
    // 파일이 없으면 비밀번호 설정 진행
  }

  const pw = req.body.pw;

  if (!pw || pw.length < 8) {
    res.send(await renderPasswordSetupWithError('비밀번호는 8자 이상이어야 합니다.')); // await 추가
    return;
  }

  try {

    writelog('Auth', `Password set attempt from : ${clientIP}`);
    const hash = await bcrypt.hash(pw, 10);
    await fs.writeFile(PASSWORD_FILE, hash); // fs.writeFile 사용
    const token = createSession();
    res.cookie(SESSION_COOKIE, token, { httpOnly: true });
    res.redirect('/');

    writelog('Auth', `Login success from : ${clientIP}`);
    writelog('Auth', `Session created: ${token} for IP: ${clientIP}`);

  } catch (e) { // 에러 객체 받기
    console.error('Password set error:', e); // 에러 로깅
    res.send(await renderPasswordSetupWithError('오류가 발생했습니다.')); // await 추가
  }
});

authRouter.post('/login', async (req: Request, res: Response) => {

  const clientIP = req.headers['x-forwarded-for'] || req.ip || req.socket.remoteAddress || 'Unknown IP';

  writelog('Auth', `Login attempt from : ${clientIP}`);

  try {
    await fs.access(PASSWORD_FILE); // fs.access 사용
  } catch {
    // PASSWORD_FILE이 없으면 설정 페이지로 리다이렉트
    res.redirect('/auth');
    return;
  }

  try {

    const pw = req.body.pw;

    if (!pw) {
      writelog('Auth', `Login fail(password empty) from : ${clientIP}`);
      res.send(await renderLoginWithError('비밀번호를 입력해주세요.')); // await 추가
      return;
    }

    const hash = await fs.readFile(PASSWORD_FILE, 'utf-8'); // fs.readFile 사용
    const ok = await bcrypt.compare(pw, hash);

    if (!ok) {
      writelog('Auth', `Login fail(wrong password) from : ${clientIP}`);
      res.send(await renderLoginWithError('비밀번호가 틀렸습니다.')); // await 추가
      return;
    }

    writelog('Auth', `Login success from : ${clientIP}`);

    const token = createSession();
    writelog('Auth', `Session created: ${token} for IP: ${clientIP}`);

    res.cookie(SESSION_COOKIE, token, { httpOnly: true });
    res.redirect('/');

  } catch (e) { // 에러 객체 받기
    console.error('Login error:', e); // 에러 로깅
    res.send(await renderLoginWithError('로그인 처리 중 오류가 발생했습니다.')); // await 추가
  }
});
