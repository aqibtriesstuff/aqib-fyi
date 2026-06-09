'use client';

const LINKS = [
  { label: 'email',    href: 'mailto:aqib7raza@gmail.com' },
  { label: 'linkedin', href: 'https://www.linkedin.com/in/aqib-raza/' },
  { label: 'x',        href: 'https://x.com/aqwe_eb' },
  { label: 'substack', href: 'https://substack.com/@aqweeb' },
];

export default function PageFooter() {
  return (
    <footer style={{ marginTop: '4rem', paddingTop: '1.5rem', borderTop: '1px solid rgba(155,110,26,0.2)', display: 'flex', gap: '1.5rem', fontSize: '0.88rem' }}>
      {LINKS.map(({ label, href }) => (
        <a
          key={label}
          href={href}
          target={href.startsWith('mailto') ? undefined : '_blank'}
          rel={href.startsWith('mailto') ? undefined : 'noopener noreferrer'}
          style={{ color: '#7A6B52', textDecoration: 'none', transition: 'color 0.15s' }}
          onMouseEnter={e => (e.currentTarget.style.color = '#9B6E1A')}
          onMouseLeave={e => (e.currentTarget.style.color = '#7A6B52')}
        >
          {label}
        </a>
      ))}
    </footer>
  );
}
