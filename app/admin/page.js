'use client';

import { useEffect, useState } from 'react';
import { cleanLink, sortLinks, withOrder } from '../../lib/links';
import { fetchLinksFile, saveLinksFile } from '../../lib/github';

const TOKEN_KEY = 'miliverse_gh_token';
const EMPTY_FORM = { title: '', price: '', affiliateUrl: '', reelUrl: '', emoji: '💗' };
const EMOJIS = ['💗', '🌸', '💜', '🎀', '✨', '🌷', '🍑', '👗', '👜', '👠', '💅', '🦋'];

const newId = () =>
  'l' + Date.now().toString(36) + Math.random().toString(36).slice(2, 8);

export default function AdminPage() {
  const [token, setToken] = useState(null); // null = loading
  const [tokenInput, setTokenInput] = useState('');
  const [links, setLinks] = useState([]);
  const [sha, setSha] = useState(null);
  const [form, setForm] = useState(EMPTY_FORM);
  const [editingId, setEditingId] = useState(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const [savedTick, setSavedTick] = useState(0);

  useEffect(() => {
    try {
      setToken(localStorage.getItem(TOKEN_KEY) || '');
    } catch {
      setToken('');
    }
  }, []);

  useEffect(() => {
    if (token) load(token).catch(() => {});
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token]);

  const friendlyError = (e) => {
    const m = String(e && e.message);
    if (m === 'bad-token') return 'that token did not work — check it and try again 💔';
    if (m === 'conflict')
      return 'someone else changed the links just now — reloading fresh, try again 🔄';
    return 'something went wrong — try again 💔';
  };

  const load = async (tk) => {
    setBusy(true);
    setError('');
    try {
      const { sha: s, links: l } = await fetchLinksFile(tk);
      setSha(s);
      setLinks(sortLinks(l));
    } catch (e) {
      setError(friendlyError(e));
      if (String(e && e.message) === 'bad-token') {
        try {
          localStorage.removeItem(TOKEN_KEY);
        } catch {}
        setToken('');
      }
    } finally {
      setBusy(false);
    }
  };

  const unlock = async (e) => {
    e.preventDefault();
    const tk = tokenInput.trim();
    if (!tk) return;
    setBusy(true);
    setError('');
    try {
      await fetchLinksFile(tk);
      try {
        localStorage.setItem(TOKEN_KEY, tk);
      } catch {}
      setTokenInput('');
      setToken(tk);
    } catch (err) {
      setError(friendlyError(err));
    } finally {
      setBusy(false);
    }
  };

  const logout = () => {
    try {
      localStorage.removeItem(TOKEN_KEY);
    } catch {}
    setToken('');
    setLinks([]);
    setSha(null);
  };

  const persist = async (nextLinks, message) => {
    const ordered = withOrder(nextLinks);
    const newSha = await saveLinksFile(token, ordered, sha, message);
    setSha(newSha);
    setLinks(ordered);
    setSavedTick((t) => t + 1);
  };

  const set = (k, v) => setForm((f) => ({ ...f, [k]: v }));

  const submit = async (e) => {
    e.preventDefault();
    if (!form.title.trim()) {
      setError('give the product a name first 🏷️');
      return;
    }
    setBusy(true);
    setError('');
    try {
      if (editingId) {
        const next = links.map((l) =>
          l.id === editingId ? { ...l, ...cleanLink(form) } : l
        );
        await persist(next, `Update link: ${form.title} (miliverse admin)`);
      } else {
        const item = { id: newId(), ...cleanLink(form) };
        await persist([...links, item], `Add link: ${form.title} (miliverse admin)`);
      }
      setForm(EMPTY_FORM);
      setEditingId(null);
    } catch (err) {
      setError(friendlyError(err));
      if (String(err && err.message) === 'conflict') load(token).catch(() => {});
    } finally {
      setBusy(false);
    }
  };

  const startEdit = (l) => {
    setEditingId(l.id);
    setForm({
      title: l.title || '',
      price: l.price || '',
      affiliateUrl: l.affiliateUrl || '',
      reelUrl: l.reelUrl || '',
      emoji: l.emoji || '💗',
    });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const cancelEdit = () => {
    setEditingId(null);
    setForm(EMPTY_FORM);
    setError('');
  };

  const remove = async (l) => {
    if (!confirm(`Delete "${l.title}"?`)) return;
    setBusy(true);
    setError('');
    try {
      await persist(
        links.filter((x) => x.id !== l.id),
        `Delete link: ${l.title} (miliverse admin)`
      );
    } catch (err) {
      setError(friendlyError(err));
    } finally {
      setBusy(false);
    }
  };

  const move = async (index, dir) => {
    const next = [...links];
    const j = index + dir;
    if (j < 0 || j >= next.length) return;
    [next[index], next[j]] = [next[j], next[index]];
    setBusy(true);
    setError('');
    try {
      await persist(next, 'Reorder links (miliverse admin)');
    } catch (err) {
      setError(friendlyError(err));
    } finally {
      setBusy(false);
    }
  };

  if (token === null) {
    return (
      <main className="page">
        <div className="admin-wrap">
          <div className="admin-card">
            <p className="admin-sub">loading… ✨</p>
          </div>
        </div>
      </main>
    );
  }

  if (!token) {
    return (
      <main className="page">
        <div className="admin-wrap">
          <div className="admin-card">
            <h1 className="admin-title">hi Mili 🎀</h1>
            <p className="admin-sub">
              paste your GitHub token to manage links — it stays in this
              browser only
            </p>
            {error ? <div className="admin-error">{error}</div> : null}
            <form onSubmit={unlock}>
              <div className="field">
                <label>GitHub token</label>
                <input
                  type="password"
                  value={tokenInput}
                  onChange={(e) => setTokenInput(e.target.value)}
                  placeholder="github_pat_…"
                  autoComplete="off"
                />
              </div>
              <button className="btn-primary" disabled={busy}>
                {busy ? 'checking… ✨' : 'unlock 💗'}
              </button>
            </form>
          </div>
          <div className="admin-card">
            <p className="admin-sub" style={{ textAlign: 'left', marginBottom: 8 }}>
              how to get a token (2 min, one time) 🔑
            </p>
            <ol style={{ margin: 0, paddingLeft: 20, fontSize: 14, lineHeight: 1.7 }}>
              <li>
                Open{' '}
                <a
                  href="https://github.com/settings/tokens?type=beta"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  github.com/settings/tokens
                </a>{' '}
                → <b>Generate new token</b>
              </li>
              <li>
                Name it <b>miliverse-links</b>, set repository access to{' '}
                <b>Only select repositories</b> → pick <b>miliverse-links</b>
              </li>
              <li>
                Under permissions, set <b>Contents</b> → <b>Read and write</b>,
                then <b>Generate token</b>
              </li>
              <li>Copy it and paste it above ☝️</li>
            </ol>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="page">
      <div className="admin-wrap">
        <div className="admin-top">
          <h1 className="admin-title" style={{ margin: 0, textAlign: 'left' }}>
            link manager 💗
          </h1>
          <button className="linklike" onClick={logout}>
            log out
          </button>
        </div>

        {error ? <div className="admin-error">{error}</div> : null}
        {savedTick > 0 && !error ? (
          <div
            className="admin-error"
            style={{ background: '#e7f9ef', color: '#1d9e5b' }}
          >
            saved! showing on the site in a couple of minutes ✨
          </div>
        ) : null}

        <div className="admin-card">
          <p className="admin-sub" style={{ textAlign: 'left', marginBottom: 12 }}>
            {editingId ? 'editing link ✏️' : 'add a new product link 🎀'}
          </p>
          <form onSubmit={submit}>
            <div className="field">
              <label>Product name</label>
              <input
                value={form.title}
                onChange={(e) => set('title', e.target.value)}
                placeholder="Rayon Embroidered Co-ord Set"
                maxLength={120}
              />
            </div>
            <div className="form-grid">
              <div className="field">
                <label>Price (optional)</label>
                <input
                  value={form.price}
                  onChange={(e) => set('price', e.target.value)}
                  placeholder="₹379"
                  maxLength={24}
                />
              </div>
              <div className="field">
                <label>Emoji</label>
                <input
                  value={form.emoji}
                  onChange={(e) => set('emoji', e.target.value)}
                  placeholder="💗"
                  maxLength={8}
                />
              </div>
            </div>
            <div className="field">
              <label>Meesho affiliate link</label>
              <input
                value={form.affiliateUrl}
                onChange={(e) => set('affiliateUrl', e.target.value)}
                placeholder="https://www.meesho.com/af_invite/…"
                inputMode="url"
              />
            </div>
            <div className="field">
              <label>Instagram reel link (optional)</label>
              <input
                value={form.reelUrl}
                onChange={(e) => set('reelUrl', e.target.value)}
                placeholder="https://www.instagram.com/p/…"
                inputMode="url"
              />
            </div>
            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 12 }}>
              {EMOJIS.map((em) => (
                <button
                  key={em}
                  type="button"
                  className="icon-btn"
                  onClick={() => set('emoji', em)}
                  style={form.emoji === em ? { borderColor: '#ff5e8a' } : undefined}
                >
                  {em}
                </button>
              ))}
            </div>
            <button className="btn-primary" disabled={busy}>
              {busy ? 'saving… ✨' : editingId ? 'save changes 💗' : 'add link 🎀'}
            </button>
            {editingId ? (
              <button
                type="button"
                className="linklike"
                onClick={cancelEdit}
                style={{ marginTop: 10, display: 'block', width: '100%', textAlign: 'center' }}
              >
                cancel editing
              </button>
            ) : null}
          </form>
        </div>

        {links.map((l, i) => (
          <div key={l.id} className="admin-row">
            <div style={{ fontSize: 26 }}>{l.emoji || '💗'}</div>
            <div className="grow">
              <div className="t">{l.title}</div>
              <div className="u">
                {[l.price, l.affiliateUrl ? '🛍️' : '', l.reelUrl ? '🎬' : '']
                  .filter(Boolean)
                  .join(' · ')}
              </div>
            </div>
            <button className="icon-btn" title="Move up" onClick={() => move(i, -1)}>
              ⬆️
            </button>
            <button className="icon-btn" title="Move down" onClick={() => move(i, 1)}>
              ⬇️
            </button>
            <button className="icon-btn" title="Edit" onClick={() => startEdit(l)}>
              ✏️
            </button>
            <button className="icon-btn danger" title="Delete" onClick={() => remove(l)}>
              🗑️
            </button>
          </div>
        ))}

        {links.length === 0 && !busy ? (
          <p className="empty">no links yet — add your first one above 🎀</p>
        ) : null}
      </div>
    </main>
  );
}
