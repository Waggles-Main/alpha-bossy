import React from 'react';
import { useGameStore } from '../store/useGameStore';

export default function BossDisplay() {
    const { currentBoss, currentStage } = useGameStore();

    if (!currentBoss && currentStage !== 'BOSS_BLIND') {
        return null;
    }

    // Also show if we have a currentBoss stored (which we do if upcoming or active)
    // For now store sets it only when entering Boss Blind or looking ahead? 
    // Store logic: "Select Boss" when entering Boss Blind.
    // So it only shows DURING the boss blind.

    if (!currentBoss) return null;

    return (
        <div className="absolute top-4 left-4 p-4 bg-red-900/90 border-2 border-red-500 rounded-lg shadow-lg max-w-xs z-10 text-white">
            <h2 className="text-xl font-bold mb-1 text-red-200 uppercase tracking-widest">
                Boss Blind
            </h2>
            <div className="text-2xl font-black mb-2 text-white">
                {currentBoss.name}
            </div>
            <p className="text-sm text-red-100 font-medium">
                {currentBoss.description}
            </p>
        </div>
    );
}
