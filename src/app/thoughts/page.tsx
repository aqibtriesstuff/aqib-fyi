export default function ThoughtsPage() {
  return (
    <main
      style={{
        minHeight: '100dvh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 'var(--space-3)',
        padding: 'var(--space-6)',
        textAlign: 'center',
      }}
    >
      <h1 style={{ fontSize: 'var(--text-display-lg)' }}>Thoughts</h1>
      <p style={{ color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>
        Coming soon.
      </p>
    </main>
  );
}
