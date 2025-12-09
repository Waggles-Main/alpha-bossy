'use client';

import React, { useEffect } from 'react';
import Grid from './components/Grid';
import Controls from './components/Controls';
import ScoreDisplay from './components/ScoreDisplay';
import BagModal from './components/BagModal';
import { GameEndModal } from './components/GameEndModal';
import { useGameStore } from './store/useGameStore';
import { ShopView, EventView } from './components/StageViews';
import GlyphArea from './components/GlyphArea';

export default function Home() {
  const { currentStage, initGame } = useGameStore();

  useEffect(() => {
    initGame();
  }, []);

  const isGameStage = currentStage === 'SMALL_BLIND' || currentStage === 'BIG_BLIND' || currentStage === 'BOSS_BLIND';
  const isShopStage = currentStage.includes('SHOP');
  const isEventStage = currentStage.includes('EVENT');

  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-6 bg-slate-800 p-8">
      <GameEndModal />

      {/* HUD only visible in game stages */}
      {isGameStage && (
        <>
          <ScoreDisplay />
          <GlyphArea />
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
