'use client';

import { useEffect, useState } from 'react';
import { RAW_URL, sortLinks } from '../lib/links';

// Renders the seed links instantly, then refreshes from the live
// data/links.json on GitHub so new products appear without a redeploy.
export default function LinksClient({ initialLinks }) {
  const [links, setLinks] = useState(initialLinks || []);

  useEffect(() => {
    let alive = true;
    fetch(RAW_URL, { cache: 'no-store' })
      .then((r) => (r.ok ? r.json() : null))
      .then((data) => {
        if (alive && Array.isArray(data)) setLinks(sortLinks(data));
      })
      .catch(() => {});
    return () => {
      alive = false;
    };
  }, []);

  return (
    <section className="links">
      {links.length === 0 && (
        <p className="empty">new finds dropping soon… stay tuned 🎀</p>
      )}
      {links.map((l) => (
        <article key={l.id} className="link-card">
          <div className="link-emoji">{l.emoji || '💗'}</div>
          <div className="link-body">
            <h2 className="link-title">{l.title}</h2>
            {l.price ? <span className="price-pill">{l.price}</span> : null}
            <div className="link-btns">
              {l.affiliateUrl ? (
                <a
                  className="btn-shop"
                  href={l.affiliateUrl}
                  target="_blank"
                  rel="noopener noreferrer sponsored"
                >
                  🛍️ Shop on Meesho
                </a>
              ) : null}
              {l.reelUrl ? (
                <a
                  className="btn-reel"
                  href={l.reelUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  🎬 Watch reel
                </a>
              ) : null}
            </div>
          </div>
        </article>
      ))}
    </section>
  );
}
