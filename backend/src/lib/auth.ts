import path from 'path';
import fs from 'fs';
import bcrypt from 'bcrypt';
import { v4 as uuidv4 } from 'uuid';
import { Router, Request, Response, NextFunction } from 'express';

const SAVE_DIR = path.join(__dirname, '../../auth');
const PASSWORD_FILE = path.join(SAVE_DIR, 'password.hash');
const SESSION_FILE = path.join(SAVE_DIR, 'sessions.json');
const TEMPLATES_DIR = path.join(__dirname, '../../templates');
const SESSION_COOKIE = 'nf_session';
const SESSION_TTL = 1000 * 60 * 60 * 24; // 24시간

if (!fs.existsSync(SAVE_DIR)) {
  fs.mkdirSync(SAVE_DIR, { recursive: true });
}

function loadTemplate(templateName: string): string {
  try {
    const templatePath = path.join(TEMPLATES_DIR, templateName);
    return fs.readFileSync(templatePath, 'utf-8');
  } catch {
    return '<h1>페이지를 불러올 수 없습니다.</h1>';
  }
}

function renderError(message: string): string {
  return `<h1>오류</h1><p>${message}</p>`;
}

function renderLoginWithError(errorMessage: string): string {
  const template = loadTemplate('login.html');
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

function renderPasswordSetupWithError(errorMessage: string): string {
  const template = loadTemplate('password-setup.html');
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
if (fs.existsSync(SESSION_FILE)) {
  try {
    sessions = JSON.parse(fs.readFileSync(SESSION_FILE, 'utf-8'));
  } catch {}
}

function saveSessions() {
  try {
    fs.writeFileSync(SESSION_FILE, JSON.stringify(sessions));
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

function isValidSession(token: string | undefined) {
  if (!token) return false;
  const exp = sessions[token];
  if (!exp || exp < Date.now()) {
    delete sessions[token];
    saveSessions();
    return false;
  }
  return true;
}

// 인증 미들웨어
export function requireAuth(req: Request, res: Response, next: NextFunction) {
  const token = req.cookies[SESSION_COOKIE];
  if (isValidSession(token)) return next();
  res.redirect('/auth');
}

// 인증/비밀번호 설정 라우트
export const authRouter = Router();
authRouter.get('/', (req: Request, res: Response) => {

    const clientIP = req.headers['x-forwarded-for'] || req.ip || req.socket.remoteAddress || 'Unknown IP';
    const timestamp = new Date().toISOString();
    console.log(`[Auth] ${timestamp} | Connection from: ${clientIP}`);

  if (!fs.existsSync(PASSWORD_FILE)) {
    const template = loadTemplate('password-setup.html');
    res.send(template);
  } else {
    const template = loadTemplate('login.html');
    res.send(template);
  }
});

authRouter.use(require('express').urlencoded({ extended: true }));
authRouter.post('/set', async (req: Request, res: Response) => {
  if (fs.existsSync(PASSWORD_FILE)) { res.redirect('/auth'); return; }
  const pw = req.body.pw;
  if (!pw || pw.length < 4) { 
    res.send(renderPasswordSetupWithError('비밀번호는 4자 이상이어야 합니다.')); 
    return; 
  }
  try {
    const hash = await bcrypt.hash(pw, 10);
    fs.writeFileSync(PASSWORD_FILE, hash);
    const token = createSession();
    res.cookie(SESSION_COOKIE, token, { httpOnly: true });
    res.redirect('/');
  } catch {
    res.send(renderPasswordSetupWithError('오류가 발생했습니다.'));
  }
});

authRouter.post('/login', async (req: Request, res: Response) => {

    const clientIP = req.headers['x-forwarded-for'] || req.ip || req.socket.remoteAddress || 'Unknown IP';
    const timestamp = new Date().toISOString();
    console.log(`[Auth] ${timestamp} | Try login from : ${clientIP}`);

  if (!fs.existsSync(PASSWORD_FILE)) { res.redirect('/auth'); return; }
  try {
    const pw = req.body.pw;
    if (!pw) {
      console.log(`[Auth] ${timestamp} | Login fail(empty) from  : ${clientIP}`);
      res.send(renderLoginWithError('비밀번호를 입력해주세요.'));
      return;
    }
    const hash = fs.readFileSync(PASSWORD_FILE, 'utf-8');
    const ok = await bcrypt.compare(pw, hash);
    if (!ok) { 
      console.log(`[Auth] ${timestamp} | Login fail(wrong auth) from : ${clientIP}`);
      res.send(renderLoginWithError('비밀번호가 틀렸습니다.')); 
      return; 
    }
    const token = createSession();
    res.cookie(SESSION_COOKIE, token, { httpOnly: true });
    res.redirect('/');
  } catch {
    res.send(renderLoginWithError('로그인 처리 중 오류가 발생했습니다.'));
  }
});
