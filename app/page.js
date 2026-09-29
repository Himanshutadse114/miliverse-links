import Image from 'next/image';
import seedLinks from '../data/links.json';
import LinksClient from './LinksClient';
import { sortLinks } from '../lib/links';

export const dynamic = 'force-dynamic';

const FLOATIES = ['💗', '✨', '🌸', '💕', '🎀', '⭐', '🌷', '💖'];

export default function Home() {
  const initial = sortLinks(seedLinks);

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

        <LinksClient initialLinks={initial} />

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
