'use client';

import { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { playHover, playSelect } from '@/lib/sounds';
import styles from './HomeScene.module.css';

const NAV = [
  { label: 'About', href: '/about' },
  { label: 'Projects', href: '/projects' },
  { label: 'Thoughts', href: '/thoughts' },
  { label: 'Inspirations', href: '/inspirations' },
];

export default function HomeScene({ revealed }: { revealed: boolean }) {
  const [selected, setSelected] = useState(-1);
  const itemRefs = useRef<(HTMLAnchorElement | null)[]>([]);

  // keyboard menu nav (only once the world is revealed)
  useEffect(() => {
    if (!revealed) return;
    function onKey(e: KeyboardEvent) {
      if (e.key !== 'ArrowDown' && e.key !== 'ArrowUp') return;
      e.preventDefault();
      setSelected((cur) => {
        const n = NAV.length;
        const next =
          e.key === 'ArrowDown'
            ? (cur < 0 ? 0 : (cur + 1) % n)
            : (cur < 0 ? n - 1 : (cur - 1 + n) % n);
        itemRefs.current[next]?.focus();
        playHover();
        return next;
      });
    }
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [revealed]);

  return (
    <div className={styles.scene}>
      <div className={styles.layers} aria-hidden="true">
        <Image
          src="/images/landscape/home.gif"
          alt=""
          fill
          sizes="100vw"
          priority
          unoptimized
          className={styles.gifLayer}
        />
      </div>

      {/* ambient particles drifting up over the scene */}
      <div className={styles.particles} aria-hidden="true">
        {[...Array(16)].map((_, i) => (
          <span key={i} className={styles.particle} style={particleStyle(i)} />
        ))}
      </div>

      <div className={`${styles.foreground} ${revealed ? styles.revealed : ''}`}>
        <h1 className={styles.srOnly}>aqib.fyi</h1>

        <nav className={styles.menu} aria-label="Explore">
          {NAV.map((item, i) => (
            <Link
              key={item.href}
              href={item.href}
              ref={(el) => {
                itemRefs.current[i] = el;
              }}
              className={`${styles.menuItem} ${selected === i ? styles.menuItemSelected : ''}`}
              onMouseEnter={() => {
                setSelected(i);
                playHover();
              }}
              onFocus={() => setSelected(i)}
              onClick={() => playSelect()}
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className={styles.corner}>
          <a
            className={styles.cornerLink}
            href="https://www.linkedin.com/in/aqib-raza/"
            target="_blank"
            rel="noopener noreferrer"
            onMouseEnter={() => playHover()}
            onClick={() => playSelect()}
          >
            LinkedIn
          </a>
          <a
            className={styles.cornerLink}
            href="https://x.com/aqwe_eb"
            target="_blank"
            rel="noopener noreferrer"
            onMouseEnter={() => playHover()}
            onClick={() => playSelect()}
          >
            Twitter (X)
          </a>
          <a
            className={styles.cornerLink}
            href="mailto:aqib7raza@gmail.com"
            onMouseEnter={() => playHover()}
            onClick={() => playSelect()}
          >
            aqib7raza@gmail.com
          </a>
        </div>
      </div>
    </div>
  );
}

// deterministic particle layout (same on server and client)
function particleStyle(i: number): React.CSSProperties {
  const lefts = [6, 13, 21, 28, 35, 43, 50, 57, 64, 71, 78, 85, 92, 17, 47, 74];
  const sizes = [3, 2, 4, 2, 3, 2, 4, 2, 3, 2, 4, 2, 3, 2, 3, 2];
  const durs = [24, 30, 21, 28, 26, 32, 22, 29, 25, 31, 23, 27, 30, 26, 28, 24];
  const delays = [0, 7, 3, 12, 5, 9, 1, 14, 6, 10, 2, 8, 4, 16, 18, 13];
  return {
    left: `${lefts[i]}%`,
    width: `${sizes[i]}px`,
    height: `${sizes[i]}px`,
    animationDuration: `${durs[i]}s`,
    animationDelay: `${delays[i]}s`,
  };
}
