'use client';

import HomeScene from '@/components/HomeScene/HomeScene';

export default function Home() {
  // Intro sequence is layered on in the next step; revealed for now so the
  // scene, time-of-day, toggle, and nav links are all visible to review.
  return <HomeScene revealed={true} />;
}
