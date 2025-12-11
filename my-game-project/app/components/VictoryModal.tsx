import React from 'react';
import { useGameStore } from '../store/useGameStore';
import { useProfileStore } from '../store/useProfileStore';

export default function VictoryModal() {
    const {
        goToMenu,
        roundScore,
        initGame
    } = useGameStore();

    const handleMainMenu = () => {
        goToMenu();
        initGame(); // Reset for next run
    };

    const handleEndless = () => {
        // Logic to continue run in endless mode
        // For now, just close modal? 
        // We need a way to say "Run continues".
        // If we close 'activeModal', the game resumes.
        // We should advance stage to next round (Round 9).
        useGameStore.setState({ activeModal: null });
        useGameStore.getState().advanceStage();
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm">
            <div className="bg-gradient-to-b from-yellow-900 to-yellow-950 border-4 border-yellow-500 rounded-2xl p-8 max-w-md w-full shadow-2xl text-center animate-in zoom-in duration-300">
                <h2 className="text-4xl font-black text-white mb-2 tracking-wider filter drop-shadow-lg">
                    VICTORY!
                </h2>
                <div className="w-full h-1 bg-yellow-500/50 mb-6"></div>

                <p className="text-yellow-100 text-lg mb-8">
                    You have conquered the Bosses and proven your mastery of words.
                </p>

                <div className="flex flex-col gap-3">
                    <button
                        onClick={handleEndless}
                        className="w-full py-4 bg-yellow-600 hover:bg-yellow-500 text-white font-bold rounded-xl text-xl transition-all shadow-lg hover:shadow-yellow-500/20 active:scale-95 border-b-4 border-yellow-800 hover:border-yellow-700"
                    >
                        Enter Endless Mode
                    </button>

                    <button
                        onClick={handleMainMenu}
                        className="w-full py-3 bg-gray-700 hover:bg-gray-600 text-gray-200 font-bold rounded-xl transition-all active:scale-95"
                    >
                        Return to Menu
                    </button>
                </div>
            </div>
        </div>
    );
}
