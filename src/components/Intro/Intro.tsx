'use client';

import { useState, useEffect, useCallback } from 'react';
import styles from './Intro.module.css';

interface IntroProps {
  onDone: () => void;
}

type Step =
  | { id: 'appearing' }
  | { id: 'line'; index: number; typed: string; full: boolean }
  | { id: 'choices' }
  | { id: 'response'; text: string; typed: string; full: boolean }
  | { id: 'departing' };

const LINES = [
  'Oh. A visitor.',
  "It's been a while since anyone found this place.",
  'What brings you here?',
];

const CHOICES = [
  { label: 'I came to see your work.', response: 'Smart. Come in -- the forge is worth a look.' },
  { label: 'I was just wandering.', response: 'The best kind of visit. Wander freely.' },
  { label: 'I followed a cat.', response: '...I get that a lot.' },
];

const SPEED = 28;

export default function Intro({ onDone }: IntroProps) {
  const [step, setStep] = useState<Step>({ id: 'appearing' });
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => {
      setVisible(true);
      setTimeout(() => setStep({ id: 'line', index: 0, typed: '', full: false }), 300);
    }, 200);
    return () => clearTimeout(t);
  }, []);

  /* typewriter tick */
  useEffect(() => {
    if (step.id !== 'line' && step.id !== 'response') return;
    if (step.full) return;

    const text = step.id === 'line' ? LINES[step.index] : step.text;
    if (step.typed.length >= text.length) {
      if (step.id === 'line') setStep({ ...step, full: true });
      else setStep({ ...step, full: true });
      return;
    }

    const t = setTimeout(() => {
      if (step.id === 'line') {
        setStep({ ...step, typed: text.slice(0, step.typed.length + 1) });
      } else {
        setStep({ ...step, typed: text.slice(0, step.typed.length + 1) });
      }
    }, SPEED);
    return () => clearTimeout(t);
  }, [step]);

  const advance = useCallback(() => {
    if (step.id === 'line') {
      if (!step.full) {
        const text = LINES[step.index];
        setStep({ ...step, typed: text, full: true });
        return;
      }
      const next = step.index + 1;
      if (next < LINES.length - 1) {
        setStep({ id: 'line', index: next, typed: '', full: false });
      } else if (next === LINES.length - 1) {
        setStep({ id: 'line', index: next, typed: '', full: false });
      } else {
        setStep({ id: 'choices' });
      }
    } else if (step.id === 'response' && step.full) {
      setStep({ id: 'departing' });
      setTimeout(onDone, 800);
    }
  }, [step, onDone]);

  /* advance after last line finishes */
  useEffect(() => {
    if (step.id === 'line' && step.full && step.index === LINES.length - 1) {
      const t = setTimeout(() => setStep({ id: 'choices' }), 600);
      return () => clearTimeout(t);
    }
  }, [step]);

  function choose(i: number) {
    setStep({ id: 'response', text: CHOICES[i].response, typed: '', full: false });
  }

  const dialogueText =
    step.id === 'line' ? step.typed :
    step.id === 'response' ? step.typed :
    '';

  const showCursor =
    (step.id === 'line' && !step.full) ||
    (step.id === 'response' && !step.full);

  const showContinue =
    (step.id === 'line' && step.full && step.index < LINES.length - 1) ||
    (step.id === 'response' && step.full);

  return (
    <div
      className={`${styles.overlay} ${visible ? styles.visible : ''} ${step.id === 'departing' ? styles.departing : ''}`}
      onClick={step.id === 'line' && step.index < LINES.length - 1 ? advance : undefined}
    >
      {/* avatar portrait -- placeholder until Phase 3 wires in the real avatar image */}
      <div className={`${styles.catWrap} ${step.id === 'appearing' ? '' : styles.catIn}`} />


      {/* dialogue box */}
      {step.id !== 'appearing' && (
        <div className={styles.box}>
          <div className={styles.nameTag}>Mochi</div>
          <div className={styles.text}>
            {dialogueText}
            {showCursor && <span className={styles.cursor}>|</span>}
          </div>

          {step.id === 'choices' && (
            <div className={styles.choices}>
              {CHOICES.map((c, i) => (
                <button key={i} className={styles.choice} onClick={() => choose(i)}>
                  <span className={styles.choiceArrow}>›</span>
                  {c.label}
                </button>
              ))}
            </div>
          )}

          {showContinue && (
            <button className={styles.continue} onClick={advance}>
              continue ›
            </button>
          )}
        </div>
      )}

      <p className={styles.skip} onClick={onDone}>skip</p>
    </div>
  );
}
