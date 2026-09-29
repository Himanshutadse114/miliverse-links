import { NextResponse } from 'next/server';
import { createSession, sessionCookieOptions, COOKIE_NAME } from '../../../../lib/auth';

export const dynamic = 'force-dynamic';

export async function POST(req) {
  let body = {};
  try {
    body = await req.json();
  } catch {
    // fall through to unauthorized
  }
  const expected = process.env.ADMIN_PASSWORD;
  if (!expected || body.password !== expected) {
    return NextResponse.json({ error: 'wrong password' }, { status: 401 });
  }
  const token = await createSession();
  const res = NextResponse.json({ ok: true });
  res.cookies.set(COOKIE_NAME, token, sessionCookieOptions());
  return res;
}
