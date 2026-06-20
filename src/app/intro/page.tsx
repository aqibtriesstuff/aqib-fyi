'use client';

import { useRouter } from 'next/navigation';
import Intro from '@/components/Intro/Intro';

export default function IntroPage() {
  const router = useRouter();
  return <Intro onDone={() => router.push('/home')} />;
}
