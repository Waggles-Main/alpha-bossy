import React, { useState } from 'react';
import { useGameStore } from '../store/useGameStore';
import Modal from './Modal';
import { GameButton } from './GameButton';
import UpgradeCard from './UpgradeCard';
import { UPGRADES } from '../data/upgrades';
import { Upgrade } from '../types/Upgrade';

type Tab = 'TILES' | 'RUN_INFO' | 'UPGRADES';
type SortMode = 'ALPHA' | 'POINTS';

const BagModal: React.FC = () => {
  const activeModal = useGameStore((state) => state.activeModal);
  const closeModal = useGameStore((state) => state.closeModal);
  const tileBag = useGameStore((state) => state.tileBag);

  // Run Info Data
  const { currentRound, currentStage, roundScore, targetScore, money, ownedUpgrades } = useGameStore();

  const [activeTab, setActiveTab] = useState<Tab>('TILES');
  const [sortMode, setSortMode] = useState<SortMode>('ALPHA');

  // --- Tiles Logic ---
  const letterCounts = tileBag.reduce((acc, tile) => {
    acc[tile.letter] = (acc[tile.letter] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  // Get unique letters for display
  const uniqueLetters = Object.keys(letterCounts);

  const sortedLetters = [...uniqueLetters].sort((a, b) => {
    if (sortMode === 'ALPHA') return a.localeCompare(b);
    // Points sort: Find a sample tile for points
    const tileA = tileBag.find(t => t.letter === a);
    const tileB = tileBag.find(t => t.letter === b);
    const pointsA = tileA?.points || 0;
    const pointsB = tileB?.points || 0;
    return pointsB - pointsA; // Descending points
  });


  // --- Upgrades Logic ---
  const myUpgrades = ownedUpgrades.map(id => UPGRADES[id]).filter(Boolean) as Upgrade[];

  return (
    <Modal
      isOpen={activeModal === 'BAG'}
      onClose={closeModal}
      title="Overview"
    >
      <div className="flex flex-col h-full min-h-[400px]">

        {/* Tabs */}
        <div className="flex gap-2 mb-4 border-b-2 border-slate-700 pb-2">
          <button
            onClick={() => setActiveTab('TILES')}
            className={`flex-1 py-2 font-bold uppercase rounded-t-lg transition-colors ${activeTab === 'TILES' ? 'bg-slate-700 text-white' : 'bg-slate-900 text-gray-400 hover:bg-slate-800'}`}
          >
            Tiles
          </button>
          <button
            onClick={() => setActiveTab('RUN_INFO')}
            className={`flex-1 py-2 font-bold uppercase rounded-t-lg transition-colors ${activeTab === 'RUN_INFO' ? 'bg-slate-700 text-white' : 'bg-slate-900 text-gray-400 hover:bg-slate-800'}`}
          >
            Run Info
          </button>
          <button
            onClick={() => setActiveTab('UPGRADES')}
            className={`flex-1 py-2 font-bold uppercase rounded-t-lg transition-colors ${activeTab === 'UPGRADES' ? 'bg-slate-700 text-white' : 'bg-slate-900 text-gray-400 hover:bg-slate-800'}`}
          >
            Upgrades
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto">

          {/* TILES TAB */}
          {activeTab === 'TILES' && (
            <div className="flex flex-col gap-4">
              <div className="flex justify-between items-center bg-slate-800 p-2 rounded">
                <span className="text-gray-300 font-bold text-sm">Sort By:</span>
                <div className="flex gap-2">
                  <button
                    onClick={() => setSortMode('ALPHA')}
                    className={`px-3 py-1 text-xs font-bold rounded ${sortMode === 'ALPHA' ? 'bg-blue-600 text-white' : 'bg-slate-600 text-gray-300'}`}
                  >
                    A-Z
                  </button>
                  <button
                    onClick={() => setSortMode('POINTS')}
                    className={`px-3 py-1 text-xs font-bold rounded ${sortMode === 'POINTS' ? 'bg-blue-600 text-white' : 'bg-slate-600 text-gray-300'}`}
                  >
                    Points
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-6 gap-2">
                {sortedLetters.map(letter => {
                  const tile = tileBag.find(t => t.letter === letter);
                  if (!tile) return null;
                  return (
                    <div key={letter} className="flex flex-col items-center justify-center p-2 rounded-md bg-gray-700 border border-gray-600 relative aspect-square">
                      <span className="font-black text-xl text-white">{letter === 'Blank' ? '?' : letter}</span>
                      <span className="text-[0.6rem] text-gray-400">count: {letterCounts[letter]}</span>
                      <span className="absolute top-1 right-1 text-xs font-bold text-blue-300">{tile.points}</span>
                    </div>
                  );
                })}
              </div>
              <div className="text-center text-xs text-gray-500 mt-2">
                Total Tiles: {tileBag.length}
              </div>
            </div>
          )}


          {/* RUN INFO TAB */}
          {activeTab === 'RUN_INFO' && (
            <div className="flex flex-col gap-4 p-4 text-center">
              <div className="bg-slate-800 p-4 rounded-xl border border-slate-700">
                <h3 className="text-gray-400 text-sm uppercase tracking-widest mb-1">Current Round</h3>
                <div className="text-4xl font-black text-white">{currentRound}</div>
              </div>
              <div className="bg-slate-800 p-4 rounded-xl border border-slate-700">
                <h3 className="text-gray-400 text-sm uppercase tracking-widest mb-1">Stage</h3>
                <div className="text-2xl font-bold text-purple-400">{currentStage.replace(/_/g, ' ')}</div>
              </div>
              <div className="bg-slate-800 p-4 rounded-xl border border-slate-700">
                <h3 className="text-gray-400 text-sm uppercase tracking-widest mb-1">Score Goal</h3>
                <div className="text-xl font-bold text-white">
                  <span className="text-yellow-400">{roundScore}</span> / {targetScore}
                </div>
              </div>
            </div>
          )}


          {/* UPGRADES TAB */}
          {activeTab === 'UPGRADES' && (
            <div className="flex flex-col items-center min-h-[200px]">
              {myUpgrades.length > 0 ? (
                <div className="flex flex-wrap justify-center gap-4">
                  {myUpgrades.map(upgrade => (
                    <UpgradeCard
                      key={upgrade.id}
                      upgrade={upgrade}
                      isPurchased={true}
                      onAction={() => { }}
                    // No action for owned upgrades in bag usually, or maybe "View"?
                    // Just display properties
                    />
                  ))}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center h-full mt-12 text-gray-500">
                  <div className="text-4xl mb-4 opacity-50">🛍️</div>
                  <p className="italic">No upgrades purchased this run</p>
                </div>
              )}
            </div>
          )}

        </div>

      </div>
    </Modal>
  );
};

export default BagModal;
