'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import styles from './NavStrip.module.css';

type Panel = {
  key: string;
  label: string;
  href: string;
  img: string;       // desktop strip image (2:1)
  imgMobile: string; // phone bar image (6:1)
};

const PANELS: Panel[] = [
  { key: 'home', label: 'Home', href: '/', img: '/images/nav/home.png', imgMobile: '/images/nav/mobile/6to1/home.png' },
  { key: 'about', label: 'About', href: '/about', img: '/images/nav/about.png', imgMobile: '/images/nav/mobile/6to1/about.png' },
  { key: 'projects', label: 'Projects', href: '/projects', img: '/images/nav/projects.png', imgMobile: '/images/nav/mobile/6to1/projects.png' },
  { key: 'thoughts', label: 'Thoughts', href: '/thoughts', img: '/images/nav/thoughts.jpg', imgMobile: '/images/nav/mobile/6to1/thoughts.png' },
  { key: 'inspirations', label: 'Inspirations', href: '/inspirations', img: '/images/nav/inspirations.png', imgMobile: '/images/nav/mobile/6to1/inspirations.png' },
];

export default function NavStrip() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  // Highlight the panel matching the first path segment.
  // e.g. /projects/kraftedx/scout -> "projects" stays active.
  const segment = pathname.split('/')[1] ?? '';

  // Close the phone menu whenever the route changes.
  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  // While the phone menu is open, Escape closes it.
  useEffect(() => {
    if (!open) return;
    function onKey(e: KeyboardEvent) {
      if (e.key === 'Escape') setOpen(false);
    }
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [open]);

  // The homepage uses its own floating links, not this nav.
  if (pathname === '/') return null;

  return (
    <div className={styles.root}>
      {/* Desktop / tablet: the horizontal panel strip */}
      <nav className={styles.strip} aria-label="Site sections">
        {PANELS.map((panel) => {
          const isActive = panel.key === segment;
          return (
            <Link
              key={panel.key}
              href={panel.href}
              className={`${styles.panel} ${isActive ? styles.active : ''}`}
              aria-current={isActive ? 'page' : undefined}
            >
              <Image
                src={panel.img}
                alt=""
                fill
                sizes="20vw"
                className={styles.image}
                unoptimized
              />
              <span className={styles.label}>{panel.label}</span>
            </Link>
          );
        })}
      </nav>

      {/* Phones: an "Explore" bar that toggles a stacked list of slim bars */}
      <nav className={styles.mobile} aria-label="Site sections">
        <button
          type="button"
          className={styles.exploreBtn}
          aria-expanded={open}
          aria-controls="mobile-nav-menu"
          onClick={() => setOpen((o) => !o)}
          style={{ backgroundImage: 'url(/images/nav/mobile/6to1/explore.png)', backgroundSize: 'cover', backgroundPosition: 'center' }}
        >
          <svg className={styles.compass} width="20" height="20" viewBox="0 0 24 24" aria-hidden="true">
            <circle cx="12" cy="12" r="8.5" fill="none" stroke="currentColor" strokeWidth="1.4" />
            <path d="M12 5.5 L13.6 12 L12 18.5 L10.4 12 Z" fill="currentColor" />
          </svg>
          <span>Explore</span>
          <svg
            className={`${styles.chevron} ${open ? styles.chevronOpen : ''}`}
            width="16"
            height="16"
            viewBox="0 0 16 16"
            aria-hidden="true"
          >
            <path
              d="M3.5 6 L8 10.5 L12.5 6"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.6"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </button>

        <ul
          id="mobile-nav-menu"
          className={`${styles.menu} ${open ? styles.menuOpen : ''}`}
        >
          {PANELS.map((panel) => {
            const isActive = panel.key === segment;
            return (
              <li key={panel.key}>
                <Link
                  href={panel.href}
                  className={`${styles.bar} ${isActive ? styles.barActive : ''}`}
                  aria-current={isActive ? 'page' : undefined}
                  tabIndex={open ? 0 : -1}
                  onClick={() => setOpen(false)}
                >
                  <Image
                    src={panel.imgMobile}
                    alt=""
                    fill
                    sizes="100vw"
                    className={styles.barImage}
                    unoptimized
                  />
                  <span className={styles.barLabel}>{panel.label}</span>
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>
    </div>
  );
}
