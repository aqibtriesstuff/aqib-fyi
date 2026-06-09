import type { Metadata } from 'next';
import TalkButton from '@/components/TalkButton';

export const metadata: Metadata = {
  title: 'library — aqib raza',
  description: 'What I\'ve been reading, watching, and playing.',
};

export default function Library() {
  return (
    <>
      <TalkButton />
      <main style={{ maxWidth: '65ch', margin: '0 auto', padding: '5rem 2rem' }}>

        <h1 style={{ fontSize: '2rem', fontWeight: 500, marginBottom: '0.4rem', color: '#9B6E1A', letterSpacing: '0.02em' }}>library</h1>
        <div style={{ width: '2.5rem', height: 2, background: 'linear-gradient(to right, #9B6E1A, transparent)', marginBottom: '2.5rem' }} />

        <p style={{ color: '#7A6B52', fontStyle: 'italic', fontSize: '1.05rem', lineHeight: 1.8 }}>
          Coming soon. This will be a full archive of everything I&apos;ve read, watched, and played -- tagged, rated, annotated.
        </p>

      </main>
    </>
  );
}
