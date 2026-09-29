import Image from 'next/image';
import { getLinks } from '../lib/store';

export const dynamic = 'force-dynamic';

const FLOATIES = ['💗', '✨', '🌸', '💕', '🎀', '⭐', '🌷', '💖'];

export default async function Home() {
  const links = await getLinks();

  return (
    <main className="page">
      <div className="floaties" aria-hidden="true">
        {FLOATIES.map((e, i) => (
          <span key={i}>{e}</span>
        ))}
      </div>

      <div className="wrap">
        <header className="profile">
          <div className="avatar-ring">
            <Image
              src="/avatar.png"
              alt="Mili"
              width={118}
              height={118}
              className="avatar"
              priority
            />
          </div>
          <h1 className="name">Mili 💗</h1>
          <p className="tagline">budget Meesho finds, picked with love</p>
          <a
            className="ig-btn"
            href="https://www.instagram.com/miliverse.io"
            target="_blank"
            rel="noopener noreferrer"
          >
            📸 @miliverse.io
          </a>
        </header>

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

        <footer className="footer">
          <p>made with 💗 by Mili</p>
          <p className="disclosure">
            #ad · 🛍️ links are affiliate links — shopping through them supports
            Mili at no extra cost to you
          </p>
        </footer>
      </div>
    </main>
  );
}
