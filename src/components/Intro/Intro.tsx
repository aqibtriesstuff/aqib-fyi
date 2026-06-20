'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { playTick, playAdvance, playHover, playSelect, playClose, playPurr, playGrumble, unlockAudio } from '@/lib/sounds';
import styles from './Intro.module.css';

type LineStyle = 'boot' | 'say' | 'cmd';
type Line = { text: string; style: LineStyle; pause?: number };

// ----- the ASCII cat ------------------------------------------------------
// a small sitting cat. only the eyes line changes, so it animates cleanly.
const CAT_HEAD = ' /\\_/\\ ';
const CAT_FACES: [string, string][] = [
  ['( o.o )', ' > ^ < '], // 0 idle
  ['( -.- )', ' > ^ < '], // 1 blink
  ['( o.o )', ' > u < '], // 2 lick
  ['( o.- )', ' > ^ < '], // 3 wink
  ['( ^.^ )', ' > w < '], // 4 happy
  ['( =.= )', ' > ^ < '], // 5 sleepy
  ['( .oo )', ' > ^ < '], // 6 glance left
  ['( oo. )', ' > ^ < '], // 7 glance right
];
// [face, holdMs] -- each frame holds for its own time, so movement feels
// natural (quick blinks, lingering idles) instead of a uniform tick
const CAT_IDLE: [number, number][] = [
  [0, 1000], [6, 380], [0, 850], [7, 360], [1, 120],
  [0, 1250], [3, 220], [0, 700], [2, 480], [0, 950],
  [1, 120], [6, 320], [0, 1400], [4, 650], [0, 800],
  [7, 340], [1, 120], [5, 1500], [5, 700], [0, 1000],
];
const CAT_FACE_CURIOUS: [string, string] = ['( O.O )', ' > o < '];
const CAT_FACE_HAPPY: [string, string] = ['( ^.^ )', ' > w < '];
const CAT_FACE_PURR: [string, string] = ['( u.u )', ' > w < '];
const CAT_FACE_ANGRY: [string, string] = ['( >_< )', ' >---< '];

// ----- the spinner + its rotating "thinking" verbs (Claude-style) --------
const SPINNER = ['⠋', '⠙', '⠹', '⠸', '⠼', '⠴', '⠦', '⠧', '⠇', '⠏'];

// the spinner cycles a few of these witty "loading" verbs.
// placeholder copy -- a mix of Aqib's real lines and invented ones.
const VERB_POOL: string[] = [
  'waking the cat',
  'cleaning the litter',
  'checking the delhi aqi (grim)',
  'queuing the lo-fi',
  'compiling build v0.0.18',
  'ignoring the unread emails',
  'pretending to have it together',
  'closing 47 browser tabs',
  'rendering personality on low settings',
  'pouring the coffee',
];

const CHOICES: { label: string; response: string[] }[] = [
  {
    label: 'idk, i was just bored',
    response: [
      "lol, then that's two of us, twin.",
      "but hopefully you are slightly less bored after exploring this.",
      "enjoyy.",
    ],
  },
  {
    label: 'a friend sent me',
    response: [
      "ah, you have some good friends in that case (keep them close).",
      "make sure to tell them i said thanks.",
      "and hopefully you end up sharing it with another friend after exploring!",
    ],
  },
  {
    label: 'call it professional curiosity',
    response: [
      "aha. if you're still here then i'm already doing something right.",
      "go look at the work, and hopefully i don't lose you there.",
    ],
  },
  {
    label: 'i got lost... in the beauty of your eyes',
    response: [
      "are you trying to flirt with me right neow??",
      "bcuz if you say yes then i must say that it is working...",
      "haha, anyways, go get lost exploring now.",
    ],
  },
  {
    label: "let's just say... i know things",
    response: [
      "oh. interesting. that's a bold claim to make.",
      "i'll only believe you when i see it with my own eyes.",
      "go on, speak the age-old code.",
    ],
  },
];

const KONAMI = ['ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight', 'b', 'a'];

// password: any combo of ps/pss with optional spaces (pspsps, pss pss, ps ps ps, etc.)
function isCorrectPassword(s: string): boolean {
  return /^(ps+\s*)+$/i.test(s.trim());
}
function isMeowPassword(s: string): boolean {
  return /^m+e+o+w+[!?]*$/i.test(s.trim());
}
const PWD_WRONG = [
  "that's not it. not even close. try again.",
  "heretic. i doubt you actually know the age-old code. this is your final chance.",
  "that was also wrong. you'll not be able to summon the masters without the code, you fool.",
];
const PWD_MEOW = "you call out to the masters, yet only those who know the code can truly summon them. try again.";
const PWD_SUCCESS = [
  '.....',
  'you were not lying.',
  'you know the age old code.',
  'you must be one of the long forgotten cat whisperers.',
  'the masters remember you. you will always be welcome here.',
];
const PWD_FAIL = 'you charlatan! begone! right neow!!';

const VERB_HOLD_MS = 1850; // slow enough to read each verb comfortably
const BOOT_VERB_COUNT = 3;

const CLOSING_POOL: string[] = [
  'dimming the lights',
  'hiding the mess',
  'making it look intentional',
  'setting the scene',
  'calibrating the aesthetic',
  'saving your progress',
  'buffering the vibes',
  'putting on the playlist',
  'straightening the frames',
  'turning on the ambiance',
  'syncing with the universe',
  'loading the good stuff',
];
const CLOSING_VERB_HOLD_MS = 1300;

// days since 7 Dec 2003 -- recalculated each load, so it keeps growing
function daysOfContext(): number {
  return Math.floor((Date.now() - Date.UTC(2003, 11, 7)) / 86400000);
}

// placeholder visitor number, stable per browser, until a real counter is wired
function getVisitorNo(): number {
  try {
    const k = 'aqib.visitorNo';
    const existing = localStorage.getItem(k);
    if (existing) return parseInt(existing, 10);
    const n = 1400 + Math.floor(Math.random() * 240);
    localStorage.setItem(k, String(n));
    return n;
  } catch {
    return 1432;
  }
}

function buildGreeting(n: number): Line[] {
  return [
    { text: `greetings, visitor #${n.toLocaleString()}.`, style: 'say', pause: 650 },
    { text: "i'm npc aqib, and this is my digital garden.", style: 'say', pause: 800 },
    { text: "it's a work in progress, and always will be, so mind the bugs.", style: 'say', pause: 800 },
    { text: "but i'm glad you found it.", style: 'say', pause: 700 },
    { text: "someone once told me strangers are just friends we haven't met yet.", style: 'say', pause: 800 },
    { text: "so tell me, stranger: how come you're here?", style: 'say', pause: 450 },
  ];
}

function speedFor(s: LineStyle) {
  return s === 'cmd' ? 20 : 54;
}
function pauseFor(line: Line) {
  return line.pause ?? 600;
}

export default function Intro({ onDone }: { onDone: () => void }) {
  const [leaving, setLeaving] = useState(false);
  const [phase, setPhase] = useState<'entry' | 'boot' | 'greet' | 'choices' | 'response' | 'password' | 'closing'>('entry');

  // the cat
  const [catIdx, setCatIdx] = useState(0);
  const [curious, setCurious] = useState(false);
  const [purring, setPurring] = useState(false);
  const [annoyed, setAnnoyed] = useState(false);
  const catRef = useRef<HTMLPreElement>(null);
  const moodTimer = useRef<number | null>(null);
  const clickTimes = useRef<number[]>([]);
  // visitor number
  const [visitorNo, setVisitorNo] = useState(0);
  // the boot spinner
  const [bootVerbs, setBootVerbs] = useState<string[]>([]);
  const [bootIdx, setBootIdx] = useState(0);
  const [closingVerbs, setClosingVerbs] = useState<string[]>([]);
  const [closingIdx, setClosingIdx] = useState(0);
  const [spinFrame, setSpinFrame] = useState(0);
  const [daysStr, setDaysStr] = useState('');
  // the typed conversation
  const [greetLines, setGreetLines] = useState<Line[]>([]);
  const [greetIdx, setGreetIdx] = useState(0);
  const [printed, setPrinted] = useState<Line[]>([]);
  const [cur, setCur] = useState<Line | null>(null);
  const [typed, setTyped] = useState('');
  const [choiceSel, setChoiceSel] = useState(0);
  const [choicesRevealedCount, setChoicesRevealedCount] = useState(0);
  const [choiceTyping, setChoiceTyping] = useState('');
  const [respLines, setRespLines] = useState<string[]>([]);
  const [respIdx, setRespIdx] = useState(0);
  const [selectedChoice, setSelectedChoice] = useState(-1);
  const [pwdAttempts, setPwdAttempts] = useState(0);
  const [pwdInput, setPwdInput] = useState('');
  const [pwdDone, setPwdDone] = useState(false);
  const [passwordSolved, setPasswordSolved] = useState(false);
  const [punished, setPunished] = useState(false);
  const [glitchActive, setGlitchActive] = useState(false);
  const [glitchChars, setGlitchChars] = useState('');
  const [recovering, setRecovering] = useState(false);
  const pwdRef = useRef<HTMLInputElement>(null);
  const glitchInterval = useRef<number | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  // easter egg
  const [egg, setEgg] = useState(false);
  const konamiRef = useRef<string[]>([]);

  const finish = useCallback(() => {
    playClose();
    setLeaving(true);
    window.setTimeout(onDone, 500);
  }, [onDone]);

  // assign the visitor number once, on mount
  useEffect(() => {
    setVisitorNo(getVisitorNo());
  }, []);

  // each idle frame holds for its own duration, so the cat feels alive
  useEffect(() => {
    const hold = CAT_IDLE[catIdx % CAT_IDLE.length][1];
    const t = setTimeout(() => setCatIdx((i) => (i + 1) % CAT_IDLE.length), hold);
    return () => clearTimeout(t);
  }, [catIdx]);

  // the cat notices the cursor only when it's right up close (desktop)
  useEffect(() => {
    function onMove(e: MouseEvent) {
      const el = catRef.current;
      if (!el) return;
      const r = el.getBoundingClientRect();
      const m = 8; // small margin around the cat itself
      const near =
        e.clientX >= r.left - m &&
        e.clientX <= r.right + m &&
        e.clientY >= r.top - m &&
        e.clientY <= r.bottom + m;
      setCurious(near);
    }
    window.addEventListener('mousemove', onMove);
    return () => window.removeEventListener('mousemove', onMove);
  }, []);

  // the konami code: a hidden treat for the curious
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      const seq = [...konamiRef.current, e.key].slice(-KONAMI.length);
      konamiRef.current = seq;
      if (seq.join(',') === KONAMI.join(',')) {
        setEgg(true);
        playSelect();
        window.setTimeout(() => setEgg(false), 4500);
      }
    }
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  // auto-focus the password input when that phase starts
  useEffect(() => {
    if (phase === 'password' && pwdRef.current) pwdRef.current.focus();
  }, [phase]);

  // auto-scroll to bottom as new lines appear
  useEffect(() => {
    if (phase === 'entry' || phase === 'boot') return;
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' });
  }, [printed, cur, phase]);

  // glitch text floods the screen during punishment
  const GLITCH_POOL = '!@#$%^&*()_+-=[]{}|;:,.?/\\~`█▓▒░▀▄■□▪▫◆○●XZABORTERR0R';
  useEffect(() => {
    if (!glitchActive) {
      if (glitchInterval.current) window.clearInterval(glitchInterval.current);
      setGlitchChars('');
      return;
    }
    glitchInterval.current = window.setInterval(() => {
      let s = '';
      for (let i = 0; i < 3200; i++) {
        s += GLITCH_POOL[Math.floor(Math.random() * GLITCH_POOL.length)];
      }
      setGlitchChars(s);
    }, 40);
    return () => { if (glitchInterval.current) window.clearInterval(glitchInterval.current); };
  }, [glitchActive]);

  // spinner spins during boot and the final "opening up"
  useEffect(() => {
    if (phase !== 'boot' && phase !== 'closing') return;
    const t = setInterval(() => setSpinFrame((f) => (f + 1) % SPINNER.length), 80);
    return () => clearInterval(t);
  }, [phase]);

  const startGreet = useCallback(() => {
    setPrinted((p) => [...p, { text: `${daysStr} days of context, loaded.`, style: 'boot' }]);
    setPhase('greet');
    setGreetIdx(0);
    setCur(greetLines[0] ?? null);
    setTyped('');
  }, [greetLines, daysStr]);

  // boot: hold on each verb, then advance; after the last, the voice speaks
  useEffect(() => {
    if (phase !== 'boot' || bootVerbs.length === 0) return;
    const last = bootIdx >= bootVerbs.length - 1;
    const t = setTimeout(() => {
      if (last) {
        startGreet();
      } else {
        playAdvance();
        setBootIdx((i) => i + 1);
      }
    }, VERB_HOLD_MS);
    return () => clearTimeout(t);
  }, [phase, bootIdx, bootVerbs, startGreet]);

  // typewriter for each choice label, one after another
  useEffect(() => {
    if (phase !== 'choices' || choicesRevealedCount >= CHOICES.length) return;
    const label = CHOICES[choicesRevealedCount].label;
    if (choiceTyping.length < label.length) {
      const t = setTimeout(() => {
        setChoiceTyping(label.slice(0, choiceTyping.length + 1));
        if (label[choiceTyping.length] !== ' ') playTick();
      }, 28);
      return () => clearTimeout(t);
    }
    // finished typing this choice -- pause then reveal the next
    const t = setTimeout(() => {
      setChoicesRevealedCount((c) => c + 1);
      setChoiceTyping('');
    }, 320);
    return () => clearTimeout(t);
  }, [phase, choicesRevealedCount, choiceTyping]);

  const onLineDone = useCallback(() => {
    setPrinted((p) => (cur ? [...p, cur] : p));
    setTyped('');
    playAdvance();
    if (phase === 'greet') {
      const next = greetIdx + 1;
      if (next < greetLines.length) {
        setGreetIdx(next);
        setCur(greetLines[next]);
      } else {
        setPrinted((p) => [...p, { text: '', style: 'say' }]);
        setCur(null);
        setChoiceSel(0);
        setChoicesRevealedCount(0);
        setChoiceTyping('');
        setPhase('choices');
      }
    } else if (phase === 'response') {
      const next = respIdx + 1;
      if (next < respLines.length) {
        setRespIdx(next);
        setCur({ text: respLines[next], style: 'say', pause: 900 });
      } else {
        setCur(null);
        if (selectedChoice === 4 && !passwordSolved) {
          setPwdAttempts(0);
          setPwdInput('');
          setPwdDone(false);
          setPhase('password');
        } else {
          setPhase('closing');
        }
      }
    }
  }, [cur, phase, greetIdx, greetLines, respIdx, respLines, selectedChoice, passwordSolved]);

  // typewriter for the voice (greeting + response)
  useEffect(() => {
    if (!cur) return;
    if (typed.length < cur.text.length) {
      const t = setTimeout(() => {
        const ch = cur.text[typed.length];
        setTyped(cur.text.slice(0, typed.length + 1));
        if (ch && ch !== ' ') playTick();
      }, speedFor(cur.style));
      return () => clearTimeout(t);
    }
    const t = setTimeout(onLineDone, pauseFor(cur));
    return () => clearTimeout(t);
  }, [cur, typed, onLineDone]);

  // pick closing verbs when the closing phase starts
  useEffect(() => {
    if (phase !== 'closing') return;
    const picked = [...CLOSING_POOL].sort(() => Math.random() - 0.5).slice(0, 2);
    setClosingVerbs([...picked, 'see you out there.']);
    setClosingIdx(0);
  }, [phase]);

  // cycle through closing verbs, then hand off to the world
  useEffect(() => {
    if (phase !== 'closing' || closingVerbs.length === 0) return;
    const last = closingIdx >= closingVerbs.length - 1;
    const t = setTimeout(() => {
      if (last) {
        finish();
      } else {
        playAdvance();
        setClosingIdx((i) => i + 1);
      }
    }, CLOSING_VERB_HOLD_MS);
    return () => clearTimeout(t);
  }, [phase, closingIdx, closingVerbs, finish]);

  function begin() {
    unlockAudio();
    const verbs = [...VERB_POOL].sort(() => Math.random() - 0.5).slice(0, BOOT_VERB_COUNT);
    setGreetLines(buildGreeting(visitorNo || getVisitorNo()));
    setDaysStr(daysOfContext().toLocaleString());
    setPrinted([]);
    setBootVerbs(verbs);
    setBootIdx(0);
    setPhase('boot');
  }

  function choose(i: number) {
    playSelect();
    setSelectedChoice(i);
    setPrinted((p) => [...p, { text: `> ${CHOICES[i].label}`, style: 'cmd' }]);
    const lines = CHOICES[i].response;
    setRespLines(lines);
    setRespIdx(0);
    setCur({ text: lines[0], style: 'say', pause: 900 });
    setTyped('');
    setPhase('response');
  }

  function fastForward() {
    if (cur && typed.length < cur.text.length) setTyped(cur.text);
  }

  function petCat(e: React.MouseEvent) {
    e.stopPropagation();
    const now = Date.now();
    const recent = [...clickTimes.current, now].filter((t) => now - t < 1500);
    clickTimes.current = recent;
    if (moodTimer.current) window.clearTimeout(moodTimer.current);
    if (recent.length >= 3) {
      // over-petted: the cat has had enough
      clickTimes.current = [];
      setPurring(false);
      setAnnoyed(true);
      playGrumble();
      moodTimer.current = window.setTimeout(() => setAnnoyed(false), 1700);
    } else {
      setAnnoyed(false);
      setPurring(true);
      playPurr();
      moodTimer.current = window.setTimeout(() => setPurring(false), 1500);
    }
  }

  function submitPassword() {
    const val = pwdInput.trim();
    if (!val) return;
    setPrinted((p) => [...p, { text: `> ${val}`, style: 'cmd' }]);
    setPwdInput('');
    if (isCorrectPassword(val)) {
      setPasswordSolved(true);
      const lines = PWD_SUCCESS;
      setRespLines(lines);
      setRespIdx(0);
      setCur({ text: lines[0], style: 'say', pause: 800 });
      setTyped('');
      setPhase('response');
    } else {
      const attempt = pwdAttempts + 1;
      const msg = isMeowPassword(val) ? PWD_MEOW : PWD_WRONG[Math.min(pwdAttempts, PWD_WRONG.length - 1)];
      if (attempt >= 3) {
        setPrinted((p) => [...p, { text: msg, style: 'say' }, { text: PWD_FAIL, style: 'say' }]);
        setPwdDone(true);
        // t+1000ms: scroll back to top so punishment plays from the card
        window.setTimeout(() => {
          scrollRef.current?.scrollTo({ top: 0, behavior: 'smooth' });
        }, 1000);
        // t+2000ms: background flash + scanlines + cat angry
        window.setTimeout(() => { setPunished(true); setAnnoyed(true); }, 2000);
        // t+3200ms: shake (CSS delay 1.2s), t+4500ms: inversion (CSS delay 2.5s)
        // t+5500ms: glitch text floods in
        window.setTimeout(() => { setGlitchActive(true); }, 5500);
        // t+9500ms: glitch text off -- pure black silence for ~3.5s
        window.setTimeout(() => { setGlitchActive(false); }, 9500);
        // t+13000ms: slow recovery -- bg transitions back, content fades in
        window.setTimeout(() => {
          setPunished(false);
          setAnnoyed(false);
          setRecovering(true);
          setCur(null);
          setTyped('');
          setPrinted([]);
          setBootVerbs([]);
          setGreetLines([]);
          setSelectedChoice(-1);
          setPwdAttempts(0);
          setPwdDone(false);
          setPasswordSolved(false);
          setClosingVerbs([]);
          setClosingIdx(0);
          setPhase('entry');
        }, 13000);
        // t+15500ms: cleanup recovering state
        window.setTimeout(() => { setRecovering(false); }, 15500);
      } else {
        setPrinted((p) => [...p, { text: msg, style: 'say' }]);
        setPwdAttempts(attempt);
      }
    }
  }

  function onScreenClick() {
    if (phase === 'entry') begin();
    else if (phase === 'boot') startGreet();
    else if (phase === 'greet' || phase === 'response') fastForward();
    else if (phase === 'choices' && choicesRevealedCount < CHOICES.length) {
      setChoicesRevealedCount(CHOICES.length);
      setChoiceTyping('');
    }
  }

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === 'Escape') {
        finish();
        return;
      }
      if (phase === 'password') return;
      if (phase === 'entry') {
        e.preventDefault();
        begin();
      } else if (phase === 'boot') {
        e.preventDefault();
        startGreet();
      } else if (phase === 'choices') {
        if (choicesRevealedCount < CHOICES.length) {
          // still revealing -- any keypress skips to showing all choices
          e.preventDefault();
          setChoicesRevealedCount(CHOICES.length);
          setChoiceTyping('');
        } else if (e.key === 'ArrowDown') {
          e.preventDefault();
          playHover();
          setChoiceSel((s) => (s + 1) % CHOICES.length);
        } else if (e.key === 'ArrowUp') {
          e.preventDefault();
          playHover();
          setChoiceSel((s) => (s - 1 + CHOICES.length) % CHOICES.length);
        } else if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          choose(choiceSel);
        } else {
          const n = Number(e.key);
          if (n >= 1 && n <= CHOICES.length) choose(n - 1);
        }
      } else if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        fastForward();
      }
    }
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  });

  // compose the cat (face = eyes + mouth)
  let face: [string, string];
  if (annoyed) face = CAT_FACE_ANGRY;
  else if (purring) face = CAT_FACE_PURR;
  else if (egg) face = CAT_FACE_HAPPY;
  else if (curious) face = CAT_FACE_CURIOUS;
  else face = CAT_FACES[CAT_IDLE[catIdx % CAT_IDLE.length][0]];
  const catLines = [CAT_HEAD, face[0], face[1]];
  const catActive = egg || curious || purring || annoyed;

  return (
    <div ref={scrollRef} className={`${styles.overlay} ${leaving ? styles.leaving : ''} ${punished ? styles.punished : ''} ${recovering ? styles.recovering : ''}`} onClick={onScreenClick}>
      <div className={styles.terminal}>
        {/* the welcome card */}
        <div className={styles.box}>
          <div className={styles.boxInner}>
            <div className={styles.boxLeft}>
              <div className={styles.boxGreet}>oh. a stranger!</div>
              <div className={styles.catWrap} onClick={petCat}>
                {catActive && (
                  <span className={styles.catMark}>{annoyed ? '!!' : egg || purring ? '♪' : '!'}</span>
                )}
                <pre
                  ref={catRef}
                  className={`${styles.cat} ${curious ? styles.catCurious : ''} ${egg ? styles.catEgg : ''} ${purring ? styles.catPurr : ''} ${annoyed ? styles.catAngry : ''}`}
                  aria-hidden="true"
                >
                  {catLines.join('\n')}
                </pre>
              </div>
              <div>
                <div className={styles.catCaption}>well, you&apos;re new.</div>
                <div className={styles.catCaption}>i wonder how you ended up here.</div>
              </div>
            </div>
            <div className={styles.boxRight}>
              <div className={styles.panelHeadA}>what is this?</div>
              <div className={styles.panelLine}>proof that i am trying to think a little:</div>
              <div className={styles.panelLine}>whether that actually translated is another question though.</div>
              <div className={styles.panelHeadB}>how to get around?</div>
              <div className={styles.panelLine}>arrow keys or click. esc to bail anytime</div>
              <div className={styles.panelLine}>(rude, but allowed).</div>
            </div>
          </div>
        </div>

        {/* the flowing terminal beneath the card */}
        <div className={styles.flow}>
          {phase === 'entry' ? (
            <div className={`${styles.line} ${styles.entryPrompt}`}>
              <span className={styles.entryDesktop}>go ahead. press any key or click. see what happens.</span>
              <span className={styles.entryMobile}>go ahead. tap anywhere. see what happens.</span>
            </div>
          ) : (
            <>
              {printed.map((l, i) => (
                <div key={i} className={`${styles.line} ${styles[l.style]}`}>
                  {l.text}
                </div>
              ))}
              {phase === 'boot' && (
                <>
                  <div className={`${styles.line} ${styles.boot} ${styles.loadingLine}`}>
                    loading {daysStr} days of context...
                  </div>
                  <div className={`${styles.line} ${styles.spinnerLine}`}>
                    <span className={styles.spinner}>{SPINNER[spinFrame]}</span> {bootVerbs[bootIdx]}...
                  </div>
                </>
              )}
              {phase === 'closing' && closingVerbs.length > 0 && (
                <div className={`${styles.line} ${styles.spinnerLine}`}>
                  <span className={styles.spinner}>{SPINNER[spinFrame]}</span> {closingVerbs[closingIdx]}
                </div>
              )}
              {cur && (
                <div className={`${styles.line} ${styles[cur.style]}`}>
                  {typed}
                  <span className={styles.caret} aria-hidden="true" />
                </div>
              )}
              {phase === 'password' && !pwdDone && (
                <div className={styles.pwdLine}>
                  <span className={styles.boot}>&gt;</span>
                  <input
                    ref={pwdRef}
                    className={styles.pwdInput}
                    value={pwdInput}
                    onChange={(e) => setPwdInput(e.target.value)}
                    onKeyDown={(e) => { if (e.key === 'Enter') submitPassword(); }}
                    placeholder="speak..."
                    autoComplete="off"
                    spellCheck={false}
                  />
                </div>
              )}
              {phase === 'choices' && (
                <div className={styles.choices}>
                  {CHOICES.map((c, i) => {
                    if (i > choicesRevealedCount) return null;
                    const isTyping = i === choicesRevealedCount;
                    const label = isTyping ? choiceTyping : c.label;
                    return (
                      <button
                        key={i}
                        type="button"
                        className={`${styles.choice} ${!isTyping && choiceSel === i ? styles.choiceSelected : ''}`}
                        onMouseEnter={() => { if (!isTyping) { setChoiceSel(i); playHover(); } }}
                        onClick={() => { if (!isTyping) choose(i); }}
                      >
                        <span className={styles.choiceNum}>{i + 1}</span>
                        <span>{label}{isTyping && <span className={styles.caret} aria-hidden="true" />}</span>
                      </button>
                    );
                  })}
                </div>
              )}
            </>
          )}
        </div>
      </div>

      {egg && <div className={styles.egg}>» cheat accepted: the cat trusts you now «</div>}

      {punished && <div className={styles.punishTint} aria-hidden="true" />}

      {glitchActive && (
        <div className={styles.glitchOverlay} aria-hidden="true">
          <pre className={styles.glitchText}>{glitchChars}</pre>
        </div>
      )}

      <button
        type="button"
        className={styles.skip}
        onClick={(e) => {
          e.stopPropagation();
          finish();
        }}
      >
        skip ›
      </button>
    </div>
  );
}
