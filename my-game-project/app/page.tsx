import Grid from './components/Grid';
import Controls from './components/Controls';
import ScoreDisplay from './components/ScoreDisplay';

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-around bg-gray-800 p-24">
      <ScoreDisplay />
      <Grid />
      <Controls />
    </main>
  );
}
