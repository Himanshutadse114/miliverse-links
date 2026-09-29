import { NextResponse } from 'next/server';
import { destroySession, COOKIE_NAME } from '../../../../lib/auth';

export const dynamic = 'force-dynamic';

export async function POST() {
  await destroySession();
  const res = NextResponse.json({ ok: true });
  res.cookies.set(COOKIE_NAME, '', { path: '/', maxAge: 0 });
  return res;
}
