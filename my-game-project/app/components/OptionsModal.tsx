import React from 'react';
import { useGameStore } from '../store/useGameStore';
import { GameButton } from './GameButton';
import { useProfileStore } from '../store/useProfileStore';

export const OptionsModal = () => {
    const { closeModal, money, addMoney, beatRound, initGame, goToMenu } = useGameStore();
    const { incrementRuns, activeProfileId } = useProfileStore();

    const handleNewRun = () => {
        if (activeProfileId) {
            incrementRuns(activeProfileId);
        }
        initGame();
        closeModal();
    };

    const handleMainMenu = () => {
        goToMenu();
        closeModal();
    };

    return (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 animate-in fade-in duration-200">
            <div className="bg-white p-6 rounded-xl max-w-sm w-full border-4 border-slate-900 shadow-2xl relative">

                {/* Header */}
                <h2 className="text-3xl font-black text-center mb-6 uppercase tracking-widest text-slate-800 border-b-4 border-slate-800 pb-2">
                    Options
                </h2>

                {/* Main Options */}
                <div className="flex flex-col gap-3 mb-6">
                    <GameButton variant="secondary" onClick={() => { }} className="opacity-50 cursor-not-allowed">
                        Settings
                    </GameButton>
                    <GameButton variant="secondary" onClick={handleNewRun} >
                        New Run
                    </GameButton>
                    <GameButton variant="secondary" onClick={handleMainMenu}>
                        Main Menu
                    </GameButton>
                    <GameButton variant="primary" onClick={closeModal} >
                        Back
                    </GameButton>
                </div>

                {/* Divider */}
                <div className="border-t-4 border-slate-200 my-4" />

                {/* Dev Tools */}
                <div>
                    <h3 className="text-xl font-bold text-center mb-4 uppercase text-slate-500">
                        Dev Tools
                    </h3>
                    <div className="grid grid-cols-2 gap-3">
                        <GameButton variant="success" onClick={() => addMoney(10)} >
                            + $10
                        </GameButton>
                        <GameButton variant="danger" onClick={() => beatRound()} >
                            Beat Round
                        </GameButton>
                    </div>
                </div>

            </div>
        </div>
    );
};
