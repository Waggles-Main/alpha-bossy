import React, { useState } from 'react';
import { useGameStore } from '../store/useGameStore';
import { useProfileStore } from '../store/useProfileStore';
import ProfileModal from './ProfileModal';

export default function MainMenu() {
    const { startGame, isRunActive, currentRound, currentStage, resumeGame } = useGameStore();
    const activeProfile = useProfileStore((state) => state.getActiveProfile());
    const [showProfileModal, setShowProfileModal] = useState(false);

    // Simple welcome logic (could be more complex state driven)
    const isReturning = (activeProfile?.runs || 0) > 0;
    const welcomeMessage = isReturning ? "Back again? Hit play!" : "First time? Hit play!";

    const formatStageName = (stage: string) => {
        return stage.replace(/_/g, ' ').toLowerCase().replace(/\b\w/g, (l) => l.toUpperCase());
    };

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-slate-900 text-white gap-8 p-4 relative">

            {/* Header Info */}
            <div className="absolute top-8 right-8 flex flex-col items-end">
                <span className="text-slate-400 text-sm">Playing as</span>
                <span className="text-xl font-bold text-blue-300">{activeProfile?.name}</span>
            </div>

            <div className="text-6xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-600 mb-8">
                ROGUE LEXIS
            </div>

            <div className="flex flex-col items-center gap-6 w-full max-w-xs">
                <div className="text-xl text-slate-300 italic mb-4">
                    {welcomeMessage}
                </div>

                {/* Continue button if run is active */}
                {isRunActive && (
                    <button
                        onClick={resumeGame}
                        className="w-full bg-amber-600 hover:bg-amber-500 text-white text-xl font-bold py-6 rounded-xl shadow-xl transform transition-all hover:scale-105 active:scale-95 mb-4 uppercase"
                    >
                        CONTINUE ROUND {currentRound}: {formatStageName(currentStage)}
                    </button>
                )}

                <button
                    onClick={startGame}
                    className="w-full bg-green-600 hover:bg-green-500 text-white text-2xl font-bold py-6 rounded-xl shadow-xl transform transition-all hover:scale-105 active:scale-95"
                >
                    PLAY
                </button>

                <button
                    onClick={() => setShowProfileModal(true)}
                    className="w-full bg-slate-700 hover:bg-slate-600 text-slate-200 font-bold py-4 rounded-lg border-2 border-slate-600 transform transition-all hover:border-slate-500"
                >
                    Profile
                </button>

                <button
                    className="w-full bg-slate-800 text-slate-500 font-bold py-4 rounded-lg cursor-not-allowed border border-slate-700"
                    disabled
                >
                    Options (Coming Soon)
                </button>
            </div>

            {showProfileModal && (
                <ProfileModal onClose={() => setShowProfileModal(false)} />
            )}
        </div>
    );
}
