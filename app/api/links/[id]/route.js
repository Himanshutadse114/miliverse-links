import { NextResponse } from 'next/server';
import { getLinks, saveLinks, cleanLink } from '../../../../lib/store';
import { isAuthed } from '../../../../lib/auth';

export const dynamic = 'force-dynamic';

export async function PUT(req, { params }) {
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
  const idx = links.findIndex((l) => l.id === params.id);
  if (idx === -1) {
    return NextResponse.json({ error: 'not found' }, { status: 404 });
  }
  const updated = { ...links[idx], ...cleanLink(body) };
  const next = [...links];
  next[idx] = updated;
  await saveLinks(next);
  return NextResponse.json({ link: updated });
}

export async function DELETE(req, { params }) {
  if (!(await isAuthed())) {
    return NextResponse.json({ error: 'unauthorized' }, { status: 401 });
  }
  const links = await getLinks();
  const next = links.filter((l) => l.id !== params.id);
  if (next.length === links.length) {
    return NextResponse.json({ error: 'not found' }, { status: 404 });
  }
  await saveLinks(next);
  return NextResponse.json({ ok: true });
}
