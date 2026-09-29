import { kv } from '@vercel/kv';

const LINKS_KEY = 'miliverse:links';

// Shown on the public page until the first link is saved from /admin.
export const SEED_LINKS = [
  {
    id: 'seed-coord',
    title: 'Rayon Embroidered Co-ord Set',
    price: '₹379',
    affiliateUrl:
      'https://www.meesho.com/af_invite/204861472:instagram_stories:12146795?p_id=402736968&ext_id=6ns1u0&utm_source=instagram_stories',
    reelUrl: 'https://www.instagram.com/p/Dd3f9UpsL2F/',
    emoji: '🌸',
    order: 0,
  },
  {
    id: 'seed-dungaree',
    title: 'Plum Dungaree Dress',
    price: '',
    affiliateUrl:
      'https://www.meesho.com/af_invite/204861472:instagram_stories:12132386?p_id=506405081&ext_id=8di0nt&u',
    reelUrl: '',
    emoji: '💜',
    order: 1,
  },
];

export function cleanUrl(u) {
  if (!u) return '';
  const s = String(u).trim();
  if (!s) return '';
  if (/^https?:\/\//i.test(s)) return s;
  return 'https://' + s;
}

export function cleanLink(body = {}) {
  return {
    title: String(body.title || 'Untitled').slice(0, 120),
    price: String(body.price || '').slice(0, 24),
    affiliateUrl: cleanUrl(body.affiliateUrl).slice(0, 2000),
    reelUrl: cleanUrl(body.reelUrl).slice(0, 2000),
    emoji: String(body.emoji || '💗').slice(0, 8),
  };
}

export async function getLinks() {
  try {
    const data = await kv.get(LINKS_KEY);
    if (Array.isArray(data)) {
      return [...data].sort((a, b) => (a.order ?? 0) - (b.order ?? 0));
    }
    return SEED_LINKS;
  } catch {
    return SEED_LINKS;
  }
}

export async function saveLinks(links) {
  const ordered = links.map((l, i) => ({ ...l, order: i }));
  await kv.set(LINKS_KEY, ordered);
  return ordered;
}
