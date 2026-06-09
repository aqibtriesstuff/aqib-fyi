import DialogueNav from '@/components/DialogueNav';

export default function Home() {
  return (
    <main
      style={{
        height: '100dvh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '1.5rem',
        overflow: 'hidden',
      }}
    >
      <DialogueNav />
    </main>
  );
}
