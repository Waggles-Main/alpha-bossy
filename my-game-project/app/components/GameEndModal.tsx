'use client';

import { useGameStore } from '../store/useGameStore';

export function GameEndModal() {
    const {
        activeModal,
        advanceStage,
        initGame,
        roundScore,
        targetScore,
        money,
        roundWords,
        currentReward,
        wordsRemaining
    } = useGameStore();

    if (!activeModal || (activeModal !== 'GAME_OVER' && activeModal !== 'ROUND_CLEARED')) {
        return null;
    }

    const isVictory = activeModal === 'ROUND_CLEARED';

    // Calculate potential money (preview)
    const interest = Math.min(Math.floor(money / 5), 5);
    const remainingMoney = wordsRemaining;
    const totalWin = currentReward + remainingMoney + interest;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm">
            <div className="bg-slate-900 border-2 border-slate-700 p-8 rounded-xl max-w-lg w-full shadow-2xl relative overflow-hidden">

                {/* Header */}
                <div className="text-center mb-6">
                    <h2 className={`text-4xl font-bold uppercase tracking-wider ${isVictory ? 'text-amber-400' : 'text-red-500'}`}>
                        {isVictory ? 'Round Cleared!' : 'Game Over'}
                    </h2>
                    {!isVictory && <p className="text-slate-400 mt-2">Score: {roundScore} / {targetScore}</p>}
                </div>

                {isVictory ? (
                    <div className="space-y-6">
                        {/* Word History */}
                        <div className="bg-slate-800/50 p-4 rounded-lg max-h-40 overflow-y-auto">
                            <h3 className="text-slate-400 text-sm font-bold uppercase mb-2">Words Played</h3>
                            <ul className="space-y-1">
                                {roundWords.map((entry, idx) => (
                                    <li key={idx} className="flex justify-between text-white font-mono text-sm border-b border-slate-700/50 pb-1 last:border-0">
                                        <span>{entry.word}</span>
                                        <span className="text-blue-400">{entry.score} pts</span>
                                    </li>
                                ))}
                            </ul>
                        </div>

                        {/* Cash Out Breakdown */}
                        <div className="bg-slate-800 p-4 rounded-lg border border-slate-700">
                            <div className="space-y-2 font-mono text-sm text-slate-300">
                                <div className="flex justify-between">
                                    <span>Blind Reward</span>
                                    <span className="text-amber-400 font-bold">${currentReward}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span>Remaining Words ({wordsRemaining})</span>
                                    <span className="text-amber-400 font-bold">${remainingMoney}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span>Interest (Max $5)</span>
                                    <span className="text-amber-400 font-bold">${interest}</span>
                                </div>
                            </div>
                        </div>

                        <div className="flex justify-center mt-6">
                            <button
                                onClick={advanceStage}
                                className="w-full bg-blue-600 hover:bg-blue-500 text-white py-3 rounded-lg font-bold text-xl uppercase tracking-widest transition-all shadow-lg hover:shadow-blue-500/20"
                            >
                                Cash Out ${totalWin}
                            </button>
                        </div>
                    </div>
                ) : (
                    // Game Over State
                    <div className="text-center space-y-6">
                        <div className="bg-slate-800 p-6 rounded-lg">
                            <p className="text-slate-400 mb-2">Final Score</p>
                            <p className="text-5xl font-mono text-white mb-4">{roundScore}</p>
                            <div className="text-sm text-slate-500">
                                Target was {targetScore}
                            </div>
                        </div>

                        <button
                            onClick={initGame}
                            className="bg-red-600 hover:bg-red-500 text-white px-8 py-3 rounded-lg font-bold text-lg uppercase tracking-wide transition-colors w-full"
                        >
                            Try Again
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}
