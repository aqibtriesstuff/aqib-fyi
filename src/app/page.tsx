'use client';

import { useState } from 'react';
import HomeScene from '@/components/HomeScene/HomeScene';
import Intro from '@/components/Intro/Intro';

export default function Home() {
  // intro plays over the scene on every load; when it ends, the menu reveals
  const [introDone, setIntroDone] = useState(false);

  return (
    <>
      <HomeScene revealed={introDone} />
      {!introDone && <Intro onDone={() => setIntroDone(true)} />}
    </>
  );
}
