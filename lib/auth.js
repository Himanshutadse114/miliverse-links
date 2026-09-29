import { kv } from '@vercel/kv';
import { cookies } from 'next/headers';
import { randomBytes } from 'crypto';

const SESSIONS_KEY = 'miliverse:sessions';
const COOKIE_NAME = 'miliverse_admin';
const SESSION_TTL_MS = 7 * 24 * 60 * 60 * 1000; // 7 days

export async function createSession() {
  const token = randomBytes(32).toString('hex');
  await kv.hset(SESSIONS_KEY, { [token]: Date.now() + SESSION_TTL_MS });
  return token;
}

export async function isAuthed() {
  const token = cookies().get(COOKIE_NAME)?.value;
  if (!token) return false;
  try {
    const exp = await kv.hget(SESSIONS_KEY, token);
    return !!exp && Number(exp) > Date.now();
  } catch {
    return false;
  }
}

export async function destroySession() {
  const token = cookies().get(COOKIE_NAME)?.value;
  if (token) {
    try {
      await kv.hdel(SESSIONS_KEY, token);
    } catch {
      // ignore
    }
  }
}

export function sessionCookieOptions() {
  return {
    httpOnly: true,
    sameSite: 'lax',
    path: '/',
    maxAge: 7 * 24 * 60 * 60,
    secure: process.env.NODE_ENV === 'production',
  };
}

export { COOKIE_NAME };
