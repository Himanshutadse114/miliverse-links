import { NextResponse } from 'next/server';
import { getLinks, saveLinks } from '../../../../lib/store';
import { isAuthed } from '../../../../lib/auth';

export const dynamic = 'force-dynamic';

// Body: { ids: ["id1", "id2", ...] } — new top-to-bottom order.
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
  const ids = Array.isArray(body.ids) ? body.ids : [];
  const links = await getLinks();
  const byId = new Map(links.map((l) => [l.id, l]));
  const next = [];
  for (const id of ids) {
    if (byId.has(id)) next.push(byId.get(id));
  }
  // keep any stragglers at the end, just in case
  for (const l of links) {
    if (!ids.includes(l.id)) next.push(l);
  }
  const saved = await saveLinks(next);
  return NextResponse.json({ links: saved });
}
