'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import styles from './HomeScene.module.css';

type TimeState = 'dawn' | 'day' | 'dusk' | 'twilight' | 'night';

const IMG: Record<TimeState, string> = {
  dawn: '/images/landscape/lp11-dawn.png',
  day: '/images/landscape/lp11-day.png',
  dusk: '/images/landscape/lp11-dusk.png',
  twilight: '/images/landscape/lp11-twilight.png',
  night: '/images/landscape/lp11-night.png',
};

const NAV = [
  { label: 'About', href: '/about' },
  { label: 'Projects', href: '/projects' },
  { label: 'Thoughts', href: '/thoughts' },
  { label: 'Inspirations', href: '/inspirations' },
];

const ORDER: TimeState[] = ['dawn', 'day', 'dusk', 'twilight', 'night'];

const LABEL: Record<TimeState, string> = {
  dawn: 'Dawn',
  day: 'Day',
  dusk: 'Dusk',
  twilight: 'Twilight',
  night: 'Night',
};

// quick toggle: true = animated gif background; false = the five static
// time-of-day images + manual selector. Flip to revert.
const USE_GIF: boolean = true;

function timeStateForHour(h: number): TimeState {
  if (h >= 5 && h < 8) return 'dawn';
  if (h >= 8 && h < 16) return 'day';
  if (h >= 16 && h < 18) return 'dusk';
  if (h >= 18 && h < 20) return 'twilight';
  return 'night';
}

/* ---- soft retro UI blips via Web Audio (no audio files) ---- */
let audioCtx: AudioContext | null = null;
function playTone(freq: number, durMs: number, gain: number) {
  if (typeof window === 'undefined' || !window.AudioContext) return;
  try {
    if (!audioCtx) audioCtx = new AudioContext();
    if (audioCtx.state === 'suspended') void audioCtx.resume();
    const osc = audioCtx.createOscillator();
    const g = audioCtx.createGain();
    osc.type = 'square';
    osc.frequency.value = freq;
    const t = audioCtx.currentTime;
    g.gain.setValueAtTime(gain, t);
    g.gain.exponentialRampToValueAtTime(0.0001, t + durMs / 1000);
    osc.connect(g);
    g.connect(audioCtx.destination);
    osc.start(t);
    osc.stop(t + durMs / 1000);
  } catch {
    /* ignore audio errors */
  }
}
function playHover() {
  playTone(523, 55, 0.03);
}
function playSelect() {
  playTone(659, 80, 0.04);
  window.setTimeout(() => playTone(880, 90, 0.04), 70);
}

export default function HomeScene({ revealed }: { revealed: boolean }) {
  const [active, setActive] = useState<TimeState>('day');
  const [prev, setPrev] = useState<TimeState | null>(null);
  const [auto, setAuto] = useState(true);
  const [selected, setSelected] = useState(-1);
  const itemRefs = useRef<(HTMLAnchorElement | null)[]>([]);

  const changeTo = useCallback((next: TimeState) => {
    setActive((cur) => {
      if (cur !== next) setPrev(cur);
      return next;
    });
  }, []);

  // static-image mode only: keep the scene matched to local time
  useEffect(() => {
    if (USE_GIF) return;
    function syncTime() {
      if (auto) changeTo(timeStateForHour(new Date().getHours()));
    }
    syncTime();
    const id = setInterval(syncTime, 60000);
    return () => clearInterval(id);
  }, [auto, changeTo]);

  useEffect(() => {
    if (prev === null) return;
    const t = setTimeout(() => setPrev(null), 1100);
    return () => clearTimeout(t);
  }, [prev, active]);

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

  function choose(key: TimeState) {
    setAuto(false);
    changeTo(key);
  }

  return (
    <div className={styles.scene}>
      <div className={styles.layers} aria-hidden="true">
        {USE_GIF ? (
          <Image
            src="/images/landscape/home.gif"
            alt=""
            fill
            sizes="100vw"
            priority
            unoptimized
            className={styles.gifLayer}
          />
        ) : (
          <>
            {prev && (
              <Image
                key={prev}
                src={IMG[prev]}
                alt=""
                fill
                sizes="100vw"
                className={`${styles.layer} ${styles.layerPrev}`}
                unoptimized
              />
            )}
            <Image
              key={active}
              src={IMG[active]}
              alt=""
              fill
              sizes="100vw"
              priority
              className={`${styles.layer} ${styles.layerActive}`}
              unoptimized
            />
          </>
        )}
      </div>

      {/* ambient particles drifting up over the scene */}
      <div className={styles.particles} aria-hidden="true">
        {[...Array(16)].map((_, i) => (
          <span key={i} className={styles.particle} style={particleStyle(i)} />
        ))}
      </div>

      <div className={`${styles.foreground} ${revealed ? styles.revealed : ''}`}>
        <h1 className={styles.srOnly}>aqib.fyi</h1>

        {!USE_GIF && (
          <div className={styles.timeSelect} role="group" aria-label="Time of day">
            {ORDER.map((key) => (
              <button
                key={key}
                type="button"
                className={`${styles.timeOption} ${active === key ? styles.timeActive : ''}`}
                aria-pressed={active === key}
                onClick={() => choose(key)}
              >
                {LABEL[key]}
              </button>
            ))}
          </div>
        )}

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
