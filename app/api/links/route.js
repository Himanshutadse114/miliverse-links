import { NextResponse } from 'next/server';
import { getLinks, saveLinks, cleanLink } from '../../../lib/store';
import { isAuthed } from '../../../lib/auth';
import { randomUUID } from 'crypto';

export const dynamic = 'force-dynamic';

export async function GET() {
  const links = await getLinks();
  return NextResponse.json({ links });
}

export async function POST(req) {
  if (!(await isAuthed())) {
    return NextResponse.json({ error: 'unauthorized' }, { status: 401 });
  }
  let body = {};
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: 'bad json' }, { status: 400 });
  }
  const links = await getLinks();
  const item = { id: randomUUID(), order: links.length, ...cleanLink(body) };
  const next = [...links, item];
  await saveLinks(next);
  return NextResponse.json({ link: item });
}
