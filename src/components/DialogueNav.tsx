'use client';

import { useEffect, useRef, useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';

const FIRST_LINES = [
  "Greetings, stranger!",
  "I'm Aqib. This is my corner of the internet -- a small, personal space I've built from scratch.",
  "What would you like to explore first?",
];
const RETURN_LINES = [
  "Back again? What are you looking for this time?",
];

const MENU_OPTIONS = [
  { label: 'Tell me about yourself', href: '/about' },
  { label: 'Show me your work',      href: '/work'  },
  { label: 'What have you been writing?', href: '/writing' },
  { label: 'Take me to the library', href: '/library' },
];

const SURPRISES = [
  "drummers are the coolest people in a band. above guitarists, above everyone. i will die on this hill.",
  "i have thousands of hours in RPGs. this site is basically my character sheet.",
  "my favourite book is by a korean therapist and it's about wanting to eat tteokboki. make of that what you will.",
  "i went through all of one piece. every arc. i regret nothing.",
  "i once researched indian labour law, wrote a leave policy, and got it implemented company-wide. still not sure how.",
  "i commute 3 hours a day. that's roughly 750 hours a year spent on the delhi metro thinking.",
];

const TYPE_SPEED     = 28;
const OPT_TYPE_SPEED = 16;
const OPT_GAP        = 60;
const MENU_PAUSE     = 400;
const FADE_MS        = 200;

type Phase =
  | 'typing-line'
  | 'waiting-advance'
  | 'typing-options'
  | 'menu-active'
  | 'surprise'
  | 'surprise-nav';

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
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.09);
    osc.start(ctx.currentTime);
    osc.stop(ctx.currentTime + 0.09);
  } catch { /* silent */ }
}

export default function DialogueNav() {
  const router = useRouter();
  const audioCtx = useRef<AudioContext | null>(null);

  const [lines, setLines]               = useState<string[]>(FIRST_LINES);
  const [lineIndex, setLineIndex]       = useState(0);
  const [displayText, setDisplayText]   = useState('');
  const [showCursor, setShowCursor]     = useState(true);
  const [showAdvance, setShowAdvance]   = useState(false);
  const [phase, setPhase]               = useState<Phase>('typing-line');
  const [optionLabels, setOptionLabels] = useState<string[]>([]);
  const [activeOpt, setActiveOpt]       = useState(0);
  const [surpriseText, setSurpriseText] = useState('');
  const [showSurpriseNav, setShowSurpriseNav] = useState(false);
  const [surpriseNavActive, setSurpriseNavActive] = useState(0);
  const [boxVisible, setBoxVisible]     = useState(false);
  const [textFading, setTextFading]     = useState(false);

  const phaseRef        = useRef(phase);
  const lineIndexRef    = useRef(lineIndex);
  const activeOptRef    = useRef(activeOpt);
  const optionLabelsRef = useRef(optionLabels);
  const surpriseNavRef  = useRef(surpriseNavActive);
  const displayTextRef  = useRef(displayText);

  useEffect(() => { phaseRef.current = phase; },             [phase]);
  useEffect(() => { lineIndexRef.current = lineIndex; },     [lineIndex]);
  useEffect(() => { activeOptRef.current = activeOpt; },     [activeOpt]);
  useEffect(() => { optionLabelsRef.current = optionLabels; },[optionLabels]);
  useEffect(() => { surpriseNavRef.current = surpriseNavActive; }, [surpriseNavActive]);
  useEffect(() => { displayTextRef.current = displayText; }, [displayText]);

  const typeLine = useCallback((text: string, onDone: () => void) => {
    setDisplayText('');
    setShowCursor(true);
    let i = 0;
    function tick() {
      if (i < text.length) {
        setDisplayText(text.slice(0, i + 1));
        i++;
        setTimeout(tick, TYPE_SPEED);
      } else {
        onDone();
      }
    }
    tick();
  }, []);

  const afterLineTyped = useCallback((idx: number, linesArr: string[]) => {
    if (idx === linesArr.length - 1) {
      setPhase('typing-options');
      setTimeout(() => {
        let optIdx = 0;
        function typeOpt() {
          if (optIdx >= MENU_OPTIONS.length) {
            setPhase('menu-active');
            setActiveOpt(0);
            return;
          }
          const fullLabel = MENU_OPTIONS[optIdx].label;
          let charIdx = 0;
          const currentOpt = optIdx;
          function tick() {
            if (charIdx < fullLabel.length) {
              setOptionLabels(prev => {
                const next = [...prev];
                next[currentOpt] = fullLabel.slice(0, charIdx + 1);
                return next;
              });
              charIdx++;
              setTimeout(tick, OPT_TYPE_SPEED);
            } else {
              optIdx++;
              setTimeout(typeOpt, OPT_GAP);
            }
          }
          tick();
        }
        typeOpt();
      }, MENU_PAUSE);
    } else {
      setShowCursor(false);
      setShowAdvance(true);
      setPhase('waiting-advance');
    }
  }, []);

  const advanceLine = useCallback((linesArr: string[], currentIdx: number) => {
    setShowAdvance(false);
    const nextIdx = currentIdx + 1;
    setLineIndex(nextIdx);
    setTextFading(true);
    setTimeout(() => {
      setTextFading(false);
      typeLine(linesArr[nextIdx], () => afterLineTyped(nextIdx, linesArr));
    }, FADE_MS);
  }, [typeLine, afterLineTyped]);

  const skipToEnd = useCallback((linesArr: string[], currentIdx: number) => {
    setDisplayText(linesArr[currentIdx]);
    setShowCursor(false);
    afterLineTyped(currentIdx, linesArr);
  }, [afterLineTyped]);

  // Initial entrance
  useEffect(() => {
    const returning = typeof sessionStorage !== 'undefined'
      && sessionStorage.getItem('returning-home') === 'true';
    if (returning) sessionStorage.removeItem('returning-home');

    const linesArr = returning ? RETURN_LINES : FIRST_LINES;
    setLines(linesArr);
    setOptionLabels(new Array(MENU_OPTIONS.length).fill(''));

    const delay = returning ? 200 : 400;
    setTimeout(() => {
      setBoxVisible(true);
      setTimeout(() => {
        typeLine(linesArr[0], () => afterLineTyped(0, linesArr));
      }, 160);
    }, delay);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Keyboard handler
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      const p = phaseRef.current;

      if (p === 'waiting-advance') {
        if (['ArrowUp', 'ArrowDown', 'Tab'].includes(e.key)) return;
        advanceLine(lines, lineIndexRef.current);
        return;
      }
      if (p === 'typing-line') {
        if (['ArrowUp', 'ArrowDown', 'Tab'].includes(e.key)) return;
        skipToEnd(lines, lineIndexRef.current);
        return;
      }
      if (p === 'menu-active') {
        if (e.key === 'ArrowDown') {
          e.preventDefault();
          const next = (activeOptRef.current + 1) % MENU_OPTIONS.length;
          blip(audioCtx);
          setActiveOpt(next);
        } else if (e.key === 'ArrowUp') {
          e.preventDefault();
          const prev = (activeOptRef.current - 1 + MENU_OPTIONS.length) % MENU_OPTIONS.length;
          blip(audioCtx);
          setActiveOpt(prev);
        } else if (e.key === 'Enter') {
          e.preventDefault();
          const i = activeOptRef.current;
          if (i === MENU_OPTIONS.length - 1) {
            doSurprise();
          } else {
            router.push(MENU_OPTIONS[i].href);
          }
        }
        return;
      }
      if (p === 'surprise-nav') {
        const navOpts = ['/about', '/work', '/writing'];
        if (e.key === 'ArrowDown') {
          e.preventDefault();
          blip(audioCtx);
          setSurpriseNavActive(prev => (prev + 1) % navOpts.length);
        } else if (e.key === 'ArrowUp') {
          e.preventDefault();
          blip(audioCtx);
          setSurpriseNavActive(prev => (prev - 1 + navOpts.length) % navOpts.length);
        } else if (e.key === 'Enter') {
          e.preventDefault();
          router.push(navOpts[surpriseNavRef.current]);
        }
      }
    }
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [lines, advanceLine, skipToEnd, router]);

  function doSurprise() {
    setPhase('surprise');
    const fact = SURPRISES[Math.floor(Math.random() * SURPRISES.length)];
    setTextFading(true);
    setTimeout(() => {
      setTextFading(false);
      setOptionLabels([]);
      setShowCursor(true);
      let i = 0;
      setSurpriseText('');
      function tick() {
        if (i < fact.length) {
          setSurpriseText(fact.slice(0, i + 1));
          i++;
          setTimeout(tick, TYPE_SPEED);
        } else {
          setShowCursor(false);
          setPhase('surprise-nav');
          setShowSurpriseNav(true);
          setSurpriseNavActive(0);
        }
      }
      tick();
    }, FADE_MS);
  }

  function handleBoxClick() {
    const p = phaseRef.current;
    if (p === 'waiting-advance') advanceLine(lines, lineIndexRef.current);
    else if (p === 'typing-line') skipToEnd(lines, lineIndexRef.current);
  }

  const SURPRISE_NAV = [
    { label: 'about',   href: '/about' },
    { label: 'work',    href: '/work' },
    { label: 'writing', href: '/writing' },
  ];

  return (
    <div style={{ width: 480, maxWidth: '100%' }}>
      {/* Speaker name tag */}
      <div
        style={{
          display: 'inline-block',
          fontFamily: "'EB Garamond', Georgia, serif",
          fontSize: '0.8rem',
          letterSpacing: '0.12em',
          color: '#F2E8CE',
          background: '#9B6E1A',
          padding: '2px 10px',
          marginBottom: '-2px',
          position: 'relative',
          zIndex: 1,
          opacity: boxVisible ? 1 : 0,
          transition: 'opacity 0.3s ease',
        }}
      >
        aqib
      </div>

      {/* Dialogue box */}
      <div
        role="dialog"
        aria-label="Dialogue with Aqib"
        onClick={handleBoxClick}
        style={{
          opacity: boxVisible ? 1 : 0,
          transform: boxVisible ? 'translateY(0)' : 'translateY(8px)',
          transition: 'opacity 0.32s ease, transform 0.32s ease',
          border: '2px solid #9B6E1A',
          outline: '1px solid rgba(155,110,26,0.25)',
          outlineOffset: 3,
          background: '#F2E8CE',
          padding: '1.2rem 1.4rem',
          fontFamily: "'EB Garamond', Georgia, serif",
          fontSize: '0.95rem',
          lineHeight: 1.75,
          minHeight: 160,
          cursor: phase === 'typing-line' || phase === 'waiting-advance' ? 'pointer' : 'default',
          boxShadow: '0 4px 24px rgba(28,18,8,0.18), inset 0 0 0 1px rgba(255,240,200,0.5)',
        }}
      >
        {/* Main text area */}
        {phase !== 'surprise' && phase !== 'surprise-nav' && (
          <div
            style={{
              minHeight: 60,
              opacity: textFading ? 0 : 1,
              transition: textFading ? `opacity ${FADE_MS}ms ease` : '',
            }}
          >
            <span style={{ color: '#1C1208' }}>{displayText}</span>
            {showCursor && (
              <span style={{ color: '#9B6E1A', animation: 'blink 0.8s step-end infinite' }}>|</span>
            )}
          </div>
        )}

        {/* Surprise text */}
        {(phase === 'surprise' || phase === 'surprise-nav') && (
          <div style={{ minHeight: 60, opacity: textFading ? 0 : 1, transition: textFading ? `opacity ${FADE_MS}ms ease` : '' }}>
            <span style={{ color: '#1C1208' }}>{surpriseText}</span>
            {phase === 'surprise' && showCursor && (
              <span style={{ color: '#9B6E1A', animation: 'blink 0.8s step-end infinite' }}>|</span>
            )}
          </div>
        )}

        {/* Advance prompt */}
        {showAdvance && (
          <div style={{ marginTop: '0.75rem', textAlign: 'right', fontSize: '0.72rem', letterSpacing: '0.06em', color: '#9B6E1A', animation: 'blink 1s step-end infinite' }}>
            click or press any key &#9662;
          </div>
        )}

        {/* Menu options */}
        {(phase === 'typing-options' || phase === 'menu-active') && optionLabels.length > 0 && (
          <div style={{ borderTop: '1px solid rgba(155,110,26,0.25)', marginTop: '0.8rem', paddingTop: '0.6rem' }}>
            {MENU_OPTIONS.map((opt, i) => {
              const label = optionLabels[i] || '';
              if (!label) return null;
              const isActive = phase === 'menu-active' && i === activeOpt;
              return (
                <div
                  key={opt.href}
                  onMouseEnter={() => {
                    if (phase === 'menu-active' && i !== activeOpt) { blip(audioCtx); setActiveOpt(i); }
                  }}
                  onClick={(e) => {
                    if (phase !== 'menu-active') return;
                    e.stopPropagation();
                    if (i === MENU_OPTIONS.length - 1) doSurprise();
                    else router.push(opt.href);
                  }}
                  style={{
                    display: 'flex',
                    alignItems: 'baseline',
                    gap: '0.4rem',
                    padding: '3px 0',
                    color: isActive ? '#1C1208' : '#7A6B52',
                    fontWeight: isActive ? 500 : 400,
                    cursor: phase === 'menu-active' ? 'pointer' : 'default',
                    userSelect: 'none',
                    transition: 'color 0.12s',
                    fontSize: '0.95rem',
                  }}
                >
                  <span style={{ color: '#9B6E1A', fontSize: '0.78em', width: '0.9em', display: 'inline-block', flexShrink: 0 }}>
                    {isActive ? '▶' : ' '}
                  </span>
                  <span>{label}</span>
                </div>
              );
            })}
          </div>
        )}

        {/* Surprise nav */}
        {phase === 'surprise-nav' && showSurpriseNav && (
          <div style={{ borderTop: '1px solid rgba(155,110,26,0.25)', marginTop: '0.8rem', paddingTop: '0.6rem' }}>
            <p style={{ fontStyle: 'italic', color: '#9B6E1A', marginBottom: '0.5rem', fontSize: '0.9rem' }}>alright. here&#39;s everything:</p>
            {SURPRISE_NAV.map((item, i) => {
              const isActive = i === surpriseNavActive;
              return (
                <div
                  key={item.href}
                  onMouseEnter={() => { if (i !== surpriseNavActive) { blip(audioCtx); setSurpriseNavActive(i); } }}
                  onClick={(e) => { e.stopPropagation(); router.push(item.href); }}
                  style={{
                    display: 'flex',
                    alignItems: 'baseline',
                    gap: '0.4rem',
                    padding: '3px 0',
                    color: isActive ? '#1C1208' : '#7A6B52',
                    fontWeight: isActive ? 500 : 400,
                    cursor: 'pointer',
                    userSelect: 'none',
                    transition: 'color 0.12s',
                    fontSize: '0.95rem',
                  }}
                >
                  <span style={{ color: '#9B6E1A', fontSize: '0.78em', width: '0.9em', display: 'inline-block', flexShrink: 0 }}>
                    {isActive ? '▶' : ' '}
                  </span>
                  <span>{item.label}</span>
                </div>
              );
            })}
          </div>
        )}
      </div>

      <style>{`
        @keyframes blink {
          0%, 100% { opacity: 1; }
          50%       { opacity: 0; }
        }
      `}</style>
    </div>
  );
}
