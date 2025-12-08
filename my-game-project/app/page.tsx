'use client';

import Grid from './components/Grid';
import Controls from './components/Controls';
import ScoreDisplay from './components/ScoreDisplay';
import BagModal from './components/BagModal';
import { GameEndModal } from './components/GameEndModal';
import { useGameStore } from './store/useGameStore';
import { ShopView, EventView } from './components/StageViews';

export default function Home() {
  const currentStage = useGameStore((state) => state.currentStage);

  const isGameStage = currentStage === 'SMALL_BLIND' || currentStage === 'BIG_BLIND' || currentStage === 'BOSS_BLIND';
  const isShopStage = currentStage.startsWith('SHOP');
  const isEventStage = currentStage.startsWith('EVENT');

  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-6 bg-gray-800 p-8">
      <GameEndModal />

      {/* HUD only visible in game stages, Shop has its own mini-display */}
      {isGameStage && <ScoreDisplay />}

      {isGameStage && (
        <>
          <Grid />
          <Controls />
          <BagModal />
        </>
      )}

      {isShopStage && <ShopView />}

      {isEventStage && <EventView />}

    </main>
  );
}
