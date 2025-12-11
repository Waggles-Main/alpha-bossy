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
import { OptionsModal } from './components/OptionsModal';
import VictoryModal from './components/VictoryModal';
import { useProfileStore } from './store/useProfileStore';
import StartScreen from './components/StartScreen';
import MainMenu from './components/MainMenu';
import BossDisplay from './components/BossDisplay';

export default function Home() {
  const { currentStage, initGame, appPhase, goToMenu, goToStartScreen, activeModal } = useGameStore();
  const { getActiveProfile, incrementWins, incrementRuns, activeProfileId } = useProfileStore();

  useEffect(() => {
    // Initial check for profile
    const activeProfile = getActiveProfile();
    if (activeProfile) {
      goToMenu();
    } else {
      goToStartScreen();
    }
  }, []);

  // Handle Win Condition (Round 8 Boss Defeated)
  useEffect(() => {
    if (activeModal === 'ROUND_CLEARED') {
      // Check if it was Round 8 Boss
      // We need to access state to know which round/blind it was.
      // Actually, 'activeModal' is set in 'beatRound' or 'submitWord'.
      // Better logic: useGameStore state.
      const state = useGameStore.getState();
      if (state.currentRound === 8 && state.currentStage === 'BOSS_BLIND') {
        if (activeProfileId) {
          incrementWins(activeProfileId);
        }
      }
    }
  }, [activeModal, activeProfileId, incrementWins]);

  const isGameStage = currentStage === 'SMALL_BLIND' || currentStage === 'BIG_BLIND' || currentStage === 'BOSS_BLIND';
  const isShopStage = currentStage.includes('SHOP');
  const isEventStage = currentStage.includes('EVENT');

  if (appPhase === 'START_SCREEN') {
    return <StartScreen />;
  }

  if (appPhase === 'MAIN_MENU') {
    return <MainMenu />;
  }

  // GAME PHASE
  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-6 bg-slate-800 p-8">
      <GameEndModal />

      {/* HUD only visible in game stages */}
      {isGameStage && (
        <>
          <ScoreDisplay />
          <BossDisplay />
          <GlyphArea />
          <Grid />
          <Controls />
          <BagModal />
        </>
      )}

      {isShopStage && <ShopView />}

      {isEventStage && <EventView />}

      {activeModal === 'VICTORY' && <VictoryModal />}

      {activeModal === 'OPTIONS' && <OptionsModal />}

    </main>
  );
}
