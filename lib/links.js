// Shared link helpers. The JSON file in /data is the source of truth;
// the live site refreshes it from GitHub at view time, and /admin edits it
// through the GitHub API.

export const REPO = 'Himanshutadse114/miliverse-links';
export const DATA_PATH = 'data/links.json';
export const RAW_URL = `https://raw.githubusercontent.com/${REPO}/main/${DATA_PATH}`;

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

export function sortLinks(links) {
  return [...(links || [])].sort((a, b) => (a.order ?? 0) - (b.order ?? 0));
}

export function withOrder(links) {
  return sortLinks(links).map((l, i) => ({ ...l, order: i }));
}

// Unicode-safe base64 for file contents
export function toB64(str) {
  const bytes = new TextEncoder().encode(str);
  let bin = '';
  for (const b of bytes) bin += String.fromCharCode(b);
  return btoa(bin);
}

export function fromB64(b64) {
  const bin = atob(b64.replace(/\n/g, ''));
  const bytes = new Uint8Array(bin.length);
  for (let i = 0; i < bin.length; i++) bytes[i] = bin.charCodeAt(i);
  return new TextDecoder().decode(bytes);
}
