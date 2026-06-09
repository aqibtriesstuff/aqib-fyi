'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { useRouter } from 'next/navigation';

const NAV_OPTIONS = [
  { label: 'about',   href: '/about'   },
  { label: 'work',    href: '/work'    },
  { label: 'writing', href: '/writing' },
  { label: 'library', href: '/library' },
  { label: '← home', href: '/'        },
];

function blip(audioCtx: React.MutableRefObject<AudioContext | null>) {
  try {
    if (!audioCtx.current) audioCtx.current = new AudioContext();
    const ctx  = audioCtx.current;
    const osc  = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.type = 'square';
    osc.frequency.setValueAtTime(440, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(660, ctx.currentTime + 0.04);
    gain.gain.setValueAtTime(0.08, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.08);
    osc.start(ctx.currentTime);
    osc.stop(ctx.currentTime + 0.08);
  } catch { /* silent */ }
}

export default function TalkButton() {
  const router   = useRouter();
  const audioCtx = useRef<AudioContext | null>(null);
  const [isOpen, setIsOpen]         = useState(false);
  const [activeIdx, setActiveIdx]   = useState(0);
  const activeRef = useRef(activeIdx);
  useEffect(() => { activeRef.current = activeIdx; }, [activeIdx]);

  const close = useCallback(() => setIsOpen(false), []);

  const navigate = useCallback((href: string) => {
    if (href === '/') sessionStorage.setItem('returning-home', 'true');
    router.push(href);
    close();
  }, [router, close]);

  useEffect(() => {
    if (!isOpen) return;
    function onKey(e: KeyboardEvent) {
      if (e.key === 'Escape') { close(); return; }
      if (e.key === 'ArrowDown') {
        e.preventDefault();
        blip(audioCtx);
        setActiveIdx(prev => (prev + 1) % NAV_OPTIONS.length);
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        blip(audioCtx);
        setActiveIdx(prev => (prev - 1 + NAV_OPTIONS.length) % NAV_OPTIONS.length);
      } else if (e.key === 'Enter') {
        e.preventDefault();
        navigate(NAV_OPTIONS[activeRef.current].href);
      }
    }
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [isOpen, close, navigate]);

  return (
    <>
      <button
        onClick={() => { setIsOpen(o => !o); setActiveIdx(0); }}
        aria-label="Open navigation"
        style={{
          position: 'fixed',
          top: 20,
          left: 20,
          zIndex: 50,
          fontFamily: "'EB Garamond', Georgia, serif",
          fontSize: '0.9rem',
          color: '#7A6B52',
          background: 'none',
          border: 'none',
          cursor: 'pointer',
          letterSpacing: '0.04em',
          transition: 'color 0.1s',
        }}
        onMouseEnter={e => (e.currentTarget.style.color = '#1C1208')}
        onMouseLeave={e => (e.currentTarget.style.color = '#7A6B52')}
      >
        [ talk ]
      </button>

      {isOpen && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label="Navigation"
          style={{ position: 'fixed', inset: 0, zIndex: 40 }}
        >
          {/* Backdrop */}
          <div
            onClick={close}
            style={{ position: 'absolute', inset: 0, background: '#1C1208', opacity: 0.3 }}
          />

          {/* Menu box */}
          <div
            style={{
              position: 'absolute',
              top: 20,
              left: 20,
              padding: '1.25rem',
              minWidth: 200,
              fontFamily: "'EB Garamond', Georgia, serif",
              fontSize: '0.95rem',
              lineHeight: 1.7,
              border: '2px solid #9B6E1A',
              outline: '1px solid rgba(155,110,26,0.25)',
              outlineOffset: 3,
              background: '#F2E8CE',
              boxShadow: '0 4px 24px rgba(28,18,8,0.22), inset 0 0 0 1px rgba(255,240,200,0.5)',
            }}
          >
            <div style={{ color: '#3D2E1A', marginBottom: '0.75rem' }}>Where to?</div>
            <div style={{ borderTop: '1px solid rgba(155,110,26,0.25)', paddingTop: '0.75rem' }} role="menu">
              {NAV_OPTIONS.map((opt, i) => {
                const isActive = i === activeIdx;
                return (
                  <div
                    key={opt.href}
                    role="menuitem"
                    onMouseEnter={() => { if (i !== activeIdx) { blip(audioCtx); setActiveIdx(i); } }}
                    onClick={() => navigate(opt.href)}
                    style={{
                      display: 'flex',
                      alignItems: 'baseline',
                      padding: '2px 0',
                      cursor: 'pointer',
                      color: isActive ? '#1C1208' : '#7A6B52',
                      fontWeight: isActive ? 500 : 400,
                      userSelect: 'none',
                      transition: 'color 0.1s',
                    }}
                  >
                    <span style={{ color: '#9B6E1A', fontSize: '0.8em', display: 'inline-block', width: '1em', marginRight: '0.5rem' }}>
                      {isActive ? '▶' : ' '}
                    </span>
                    {opt.label}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
