import type { Metadata } from 'next';
import TalkButton from '@/components/TalkButton';
import PageFooter from '@/components/PageFooter';

export const metadata: Metadata = {
  title: 'about — aqib raza',
  description: 'A bit about who I am.',
};

export default function About() {
  return (
    <>
      <TalkButton />
      <main style={{ maxWidth: '65ch', margin: '0 auto', padding: '5rem 2rem' }}>

        <h1 style={{ fontSize: '2rem', fontWeight: 500, marginBottom: '0.4rem', color: '#9B6E1A', letterSpacing: '0.02em' }}>about</h1>
        <div style={{ width: '2.5rem', height: 2, background: 'linear-gradient(to right, #9B6E1A, transparent)', marginBottom: '2.5rem' }} />

        <div style={{ fontSize: '1.08rem', color: '#1C1208', lineHeight: 1.8 }} className="space-y-6">

          <p className="drop-cap">
            I&apos;m Aqib. 22, based in Gurugram. I work at KraftedX, a content and creative agency, where I operate out of the Founder&apos;s Office -- meaning I do whatever the company needs. Recruitment, operations, product work, client management, writing. No fixed scope.
          </p>

          <p>
            I finished a BBA in Financial Investment Analysis from SSCBS, Delhi University in 2025. Finance gave me a framework for thinking about things structurally. The startup work is where I actually learned how to get things done.
          </p>

          <p>
            Most of my life I&apos;ve been in a support role. I&apos;m wired to help other people do their best work -- I find it genuinely satisfying, not something I settled for. At the same time, I&apos;m at a point where I want to eventually be someone people come to for guidance. Both things feel true. The tension between them is something I&apos;m sitting with and slowly working through.
          </p>

          <p>
            I&apos;m quiet by default. Small circle. I don&apos;t have natural charm and I know it. I overthink and then go with my gut. I&apos;m honest about the fact that I&apos;m lazy on some days and disciplined on others -- and that I&apos;m trying to shift that ratio.
          </p>

          <p>
            I read a lot -- fantasy and literary fiction mostly. Currently working through The Stormlight Archive and The Kingkiller Chronicle. I&apos;ve played a lot of games over the years, mostly RPGs. I think about storytelling, how systems work, and what it means to build things from scratch.
          </p>

          <p>
            The longer-term pull is toward backing people who are building things -- funding ideas, mentoring founders, being a resource for builders. Not necessarily being the one building, but being the person who bets on others early.
          </p>

          <p>
            This site is part of figuring that out. I built it from scratch with no prior technical knowledge. That alone felt worth doing.
          </p>

          <div className="ink-divider" aria-hidden="true">&#10022;</div>

          <p style={{ color: '#7A6B52', fontStyle: 'italic', fontSize: '0.98rem' }}>
            If you&apos;d like to reach me:{' '}
            <a href="mailto:aqib7raza@gmail.com" style={{ color: '#9B6E1A', fontStyle: 'normal', textDecoration: 'underline' }}>
              aqib7raza@gmail.com
            </a>
          </p>

        </div>

        <PageFooter />

      </main>
    </>
  );
}
