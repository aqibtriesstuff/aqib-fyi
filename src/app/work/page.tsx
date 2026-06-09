import type { Metadata } from 'next';
import TalkButton from '@/components/TalkButton';
import PageFooter from '@/components/PageFooter';

export const metadata: Metadata = {
  title: 'work — aqib raza',
  description: 'What I\'ve built.',
};

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section style={{ marginBottom: '2.5rem' }}>
      <h2 style={{ fontSize: '1rem', fontWeight: 500, color: '#9B6E1A', letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: '1rem' }}>{title}</h2>
      {children}
    </section>
  );
}

export default function Work() {
  return (
    <>
      <TalkButton />
      <main style={{ maxWidth: '65ch', margin: '0 auto', padding: '5rem 2rem' }}>

        <h1 style={{ fontSize: '2rem', fontWeight: 500, marginBottom: '0.4rem', color: '#9B6E1A', letterSpacing: '0.02em' }}>work</h1>
        <div style={{ width: '2.5rem', height: 2, background: 'linear-gradient(to right, #9B6E1A, transparent)', marginBottom: '2.5rem' }} />

        <div style={{ fontSize: '1.05rem', color: '#1C1208', lineHeight: 1.8 }}>

          <Section title="Current">
            <p style={{ marginBottom: '0.5rem' }}><strong>Founder&apos;s Office Executive, KraftedX</strong> <span style={{ color: '#7A6B52', fontSize: '0.9rem' }}>2024 -- present</span></p>
            <p style={{ color: '#3D2E1A', marginBottom: '1.2rem' }}>KraftedX is a content and creative agency. I operate out of the Founder&apos;s Office -- no fixed scope, which in practice means I own whatever the company needs built.</p>

            <p style={{ marginBottom: '0.5rem', color: '#7A6B52', fontSize: '0.9rem', letterSpacing: '0.04em' }}>Key projects</p>
            <div style={{ borderLeft: '2px solid rgba(155,110,26,0.2)', paddingLeft: '1rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div>
                <p style={{ fontWeight: 500 }}>Talent and recruitment, built from scratch</p>
                <p style={{ color: '#3D2E1A', fontSize: '0.97rem' }}>Designed and implemented the full hiring process from the ground up. Job descriptions, screening frameworks, interview structures, offer templates. The company had no hiring infrastructure before this.</p>
              </div>
              <div>
                <p style={{ fontWeight: 500 }}>MyContentos product implementation</p>
                <p style={{ color: '#3D2E1A', fontSize: '0.97rem' }}>Managed the rollout of a content operations product. Coordinated between client teams, handled onboarding, and translated product requirements into workflows that actually ran.</p>
              </div>
              <div>
                <p style={{ fontWeight: 500 }}>Scout service launch</p>
                <p style={{ color: '#3D2E1A', fontSize: '0.97rem' }}>Worked on the launch of Scout, a talent-focused service. Scope covered positioning, internal documentation, and operational setup before the first client engagement.</p>
              </div>
              <div>
                <p style={{ fontWeight: 500 }}>Operations and systems</p>
                <p style={{ color: '#3D2E1A', fontSize: '0.97rem' }}>Built the company handbook, CRM setup, internal processes. The infrastructure layer that makes everything else run without thinking about it.</p>
              </div>
            </div>
          </Section>

          <div className="ink-divider" aria-hidden="true">&#10022;</div>

          <Section title="Earlier">
            <p style={{ marginBottom: '0.5rem' }}><strong>Analyst, KRG Strategy Consultants</strong></p>
            <p style={{ color: '#3D2E1A', marginBottom: '1.5rem', fontSize: '0.97rem' }}>Strategy consulting work. Research, analysis, client deliverables.</p>

            <p style={{ marginBottom: '0.5rem' }}><strong>Grandeur Consulting Cell</strong></p>
            <p style={{ color: '#3D2E1A', fontSize: '0.97rem' }}>Student consulting body at SSCBS. Case work, client projects, team coordination.</p>
          </Section>

          <div className="ink-divider" aria-hidden="true">&#10022;</div>

          <Section title="Education">
            <p><strong>BBA, Financial Investment Analysis</strong></p>
            <p style={{ color: '#3D2E1A' }}>Shaheed Sukhdev College of Business Studies (SSCBS), Delhi University. Graduated 2025.</p>
          </Section>

          <div className="ink-divider" aria-hidden="true">&#10022;</div>

          <Section title="Skills">
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1rem' }}>
              <div>
                <p style={{ fontSize: '0.8rem', letterSpacing: '0.06em', color: '#9B6E1A', marginBottom: '0.4rem' }}>STRONG</p>
                <p style={{ color: '#3D2E1A', fontSize: '0.95rem', lineHeight: 1.7 }}>Ops & systems<br />Hiring<br />Writing<br />Research<br />Project management</p>
              </div>
              <div>
                <p style={{ fontSize: '0.8rem', letterSpacing: '0.06em', color: '#9B6E1A', marginBottom: '0.4rem' }}>DECENT</p>
                <p style={{ color: '#3D2E1A', fontSize: '0.95rem', lineHeight: 1.7 }}>Product thinking<br />Client work<br />Financial analysis<br />Decks & comms</p>
              </div>
              <div>
                <p style={{ fontSize: '0.8rem', letterSpacing: '0.06em', color: '#9B6E1A', marginBottom: '0.4rem' }}>BUILDING</p>
                <p style={{ color: '#3D2E1A', fontSize: '0.95rem', lineHeight: 1.7 }}>Web dev<br />React / Next.js<br />Databases<br />TypeScript</p>
              </div>
            </div>
          </Section>

          <p style={{ color: '#7A6B52', fontStyle: 'italic', fontSize: '0.97rem', marginTop: '1rem' }}>
            Resume available on request:{' '}
            <a href="mailto:aqib7raza@gmail.com" style={{ color: '#9B6E1A', fontStyle: 'normal', textDecoration: 'underline' }}>aqib7raza@gmail.com</a>
          </p>

        </div>

        <PageFooter />

      </main>
    </>
  );
}
