'use client';

import { useEffect, useState } from 'react';

const EMPTY_FORM = { title: '', price: '', affiliateUrl: '', reelUrl: '', emoji: '💗' };
const EMOJIS = ['💗', '🌸', '💜', '🎀', '✨', '🌷', '🍑', '👗', '👜', '👠', '💅', '🦋'];

async function api(path, method = 'GET', body) {
  const res = await fetch(path, {
    method,
    headers: body ? { 'Content-Type': 'application/json' } : undefined,
    body: body ? JSON.stringify(body) : undefined,
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.error || 'request failed');
  return data;
}

export default function AdminPage() {
  const [session, setSession] = useState(null); // null = loading
  const [password, setPassword] = useState('');
  const [links, setLinks] = useState([]);
  const [form, setForm] = useState(EMPTY_FORM);
  const [editingId, setEditingId] = useState(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    api('/api/admin/session')
      .then((d) => setSession(d.ok))
      .catch(() => setSession(false));
  }, []);

  const load = async () => {
    const d = await api('/api/links');
    setLinks(d.links || []);
  };

  useEffect(() => {
    if (session) load().catch(() => setError('could not load links'));
  }, [session]);

  const login = async (e) => {
    e.preventDefault();
    setBusy(true);
    setError('');
    try {
      await api('/api/admin/login', 'POST', { password });
      setPassword('');
      setSession(true);
    } catch {
      setError('wrong password — try again 💔');
    } finally {
      setBusy(false);
    }
  };

  const logout = async () => {
    await api('/api/admin/logout', 'POST').catch(() => {});
    setSession(false);
    setLinks([]);
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
        await api(`/api/links/${editingId}`, 'PUT', form);
      } else {
        await api('/api/links', 'POST', form);
      }
      setForm(EMPTY_FORM);
      setEditingId(null);
      await load();
    } catch {
      setError('could not save — try again 💔');
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
    try {
      await api(`/api/links/${l.id}`, 'DELETE');
      await load();
    } catch {
      setError('could not delete — try again 💔');
    } finally {
      setBusy(false);
    }
  };

  const move = async (index, dir) => {
    const next = [...links];
    const j = index + dir;
    if (j < 0 || j >= next.length) return;
    [next[index], next[j]] = [next[j], next[index]];
    setLinks(next);
    try {
      await api('/api/links/reorder', 'POST', { ids: next.map((l) => l.id) });
    } catch {
      setError('could not reorder — try again 💔');
      load().catch(() => {});
    }
  };

  if (session === null) {
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

  if (!session) {
    return (
      <main className="page">
        <div className="admin-wrap">
          <div className="admin-card">
            <h1 className="admin-title">hi Mili 🎀</h1>
            <p className="admin-sub">enter the admin password to manage links</p>
            {error ? <div className="admin-error">{error}</div> : null}
            <form onSubmit={login}>
              <div className="field">
                <label>Password</label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  autoComplete="current-password"
                />
              </div>
              <button className="btn-primary" disabled={busy}>
                {busy ? 'checking… ✨' : 'unlock 💗'}
              </button>
            </form>
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

        <div className="admin-card">
          <p className="admin-sub" style={{ textAlign: 'left', marginBottom: 12 }}>
            {editingId ? 'editing link ✏️' : 'add a new product link 🎀'}
          </p>
          <form onSubmit={submit}>
            <div className="field">
              <label>Product name</label>
              <input
                value={form.title}
                onChange={(e) => set(e, 'title')}
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
                  onChange={(e) => set(e, 'emoji')}
                  placeholder="💗"
                  maxLength={8}
                />
              </div>
            </div>
            <div className="field">
              <label>Meesho affiliate link</label>
              <input
                value={form.affiliateUrl}
                onChange={(e) => set(e, 'affiliateUrl')}
                placeholder="https://www.meesho.com/af_invite/…"
                inputMode="url"
              />
            </div>
            <div className="field">
              <label>Instagram reel link (optional)</label>
              <input
                value={form.reelUrl}
                onChange={(e) => set(e, 'reelUrl')}
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

        {links.length === 0 ? (
          <p className="empty">no links yet — add your first one above 🎀</p>
        ) : null}
      </div>
    </main>
  );
}
