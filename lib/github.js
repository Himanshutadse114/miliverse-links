// Client-side GitHub Contents API: /admin reads and writes data/links.json
// straight to the repo. The token is a fine-grained PAT the admin pastes once
// (stored only in their own browser's localStorage).

import { REPO, DATA_PATH, toB64, fromB64 } from './links';

const API = 'https://api.github.com';

function headers(token) {
  return {
    Authorization: `Bearer ${token}`,
    Accept: 'application/vnd.github+json',
    'X-GitHub-Api-Version': '2022-11-28',
  };
}

export async function fetchLinksFile(token) {
  const res = await fetch(
    `${API}/repos/${REPO}/contents/${DATA_PATH}?ref=main`,
    { headers: headers(token) }
  );
  if (res.status === 401) throw new Error('bad-token');
  if (res.status === 404) throw new Error('not-found');
  if (!res.ok) throw new Error('fetch-failed');
  const data = await res.json();
  let links = [];
  try {
    links = JSON.parse(fromB64(data.content));
    if (!Array.isArray(links)) links = [];
  } catch {
    links = [];
  }
  return { sha: data.sha, links };
}

export async function saveLinksFile(token, links, sha, message) {
  const res = await fetch(`${API}/repos/${REPO}/contents/${DATA_PATH}`, {
    method: 'PUT',
    headers: { ...headers(token), 'Content-Type': 'application/json' },
    body: JSON.stringify({
      message: message || 'Update links via miliverse admin',
      content: toB64(JSON.stringify(links, null, 2) + '\n'),
      sha,
      branch: 'main',
    }),
  });
  if (res.status === 401) throw new Error('bad-token');
  if (res.status === 409) throw new Error('conflict');
  if (!res.ok) throw new Error('save-failed');
  const data = await res.json();
  return data.content.sha;
}
