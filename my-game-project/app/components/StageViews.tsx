import React from 'react';
import { useGameStore } from '../store/useGameStore';

import { GameButton } from './GameButton';
import GlyphCard from './GlyphCard';
import GlyphArea from './GlyphArea';
import UpgradeCard from './UpgradeCard';

export const ShopView = () => {
    const { advanceStage, money, rerollShop, shopItems, buyGlyph, availableUpgrades, buyUpgrade, ownedUpgrades, rerollCost, hasPurchasedUpgradeThisRound } = useGameStore();

    return (
        <div className="flex flex-col items-center w-full max-w-md mx-auto min-h-screen py-8 text-black space-y-4">
            {/* Money Display (since HUD is hidden) */}
            <div className="w-full flex justify-end px-4">
                <div className="bg-slate-900 text-amber-500 px-6 py-2 rounded-full font-bold text-xl border-2 border-slate-700 shadow-lg flex items-center gap-2">
                    <span>$</span>
                    <span>{money}</span>
                </div>
            </div>

            {/* Header */}
            <div className="w-full bg-white border-2 border-slate-900 h-24 overflow-hidden relative flex items-center mb-4">
                <div className="animate-marquee text-6xl font-black tracking-widest uppercase">
                    SHOP &nbsp; SHOP &nbsp; SHOP &nbsp; SHOP &nbsp; SHOP
                </div>
            </div>

            {/* Inventory Area */}
            <div className="w-full bg-slate-800/50 p-2 border-2 border-slate-900">
                <GlyphArea />
            </div>

            {/* Items Section */}
            <div className="w-full bg-slate-100 border-2 border-slate-900 p-4">
                <div className="flex justify-center gap-4 mb-8 min-h-[240px] items-center">
                    {/* Increased container height and centered for GlyphCards */}
                    {shopItems.length > 0 ? (
                        shopItems.map((item, index) => (
                            <GlyphCard
                                key={item.instanceId || `${item.id}-${index}`} // Fallback key
                                glyph={item}
                                isShopItem={true}
                                price={item.baseCost}
                                onAction={() => buyGlyph(item)}
                            />
                        ))
                    ) : (
                        <div className="text-gray-500 italic">Sold Out</div>
                    )}
                </div>

                <GameButton
                    variant="danger"
                    onClick={rerollShop}
                    disabled={money < rerollCost}
                    className="w-full"
                >
                    REROLL ${rerollCost}
                </GameButton>
            </div>

            {/* Grab Bags Section */}
            <div className="w-full bg-white border-2 border-slate-900 p-4">
                <h3 className="text-center font-bold text-xl mb-2 uppercase">Grab Bags</h3>
                <div className="grid grid-cols-2 gap-4">
                    {[1, 2].map((i) => (
                        <div key={i} className="aspect-square bg-white border border-slate-900 flex flex-col items-center justify-between p-2 text-xs font-bold shadow-sm hover:shadow-md transition-shadow cursor-pointer">
                            <div className="text-center">
                                <div>PACK</div>
                            </div>
                            <div className="w-full h-8 bg-slate-200" /> {/* Graphic Placeholder */}
                            <div className="text-orange-500">$4</div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Round Upgrades Section */}
            <div className="w-full bg-white border-2 border-slate-900 p-4">
                <h3 className="text-center font-bold text-xl mb-2 uppercase">Round Upgrades</h3>
                <div className="flex flex-wrap justify-center gap-4 min-h-[160px] items-center">
                    {hasPurchasedUpgradeThisRound && availableUpgrades.length === 0 ? (
                        <div className="text-center">
                            <div className="text-green-600 font-bold mb-1">Upgrade purchased for Round {useGameStore.getState().currentRound}</div>
                            <div className="text-xs text-gray-500">Restocks next round</div>
                        </div>
                    ) : availableUpgrades.length > 0 ? (
                        availableUpgrades.map((upgrade) => {
                            const isLocked = !!(upgrade.type === 'DEPENDENT' && upgrade.baseUpgradeId && !ownedUpgrades.includes(upgrade.baseUpgradeId));
                            const isPurchased = ownedUpgrades.includes(upgrade.id);

                            if (isPurchased) {
                                return (
                                    <div key={upgrade.id} className="w-32 h-32 rounded-xl bg-slate-200 border-4 border-slate-300 flex items-center justify-center m-2 select-none">
                                        <div className="text-center">
                                            <span className="text-slate-400 font-bold uppercase tracking-widest text-sm block">Purchased</span>
                                            <span className="text-slate-400 text-[10px] mt-1">Refreshes next round</span>
                                        </div>
                                    </div>
                                );
                            }

                            // If somehow visible but limit reached (e.g. bug or same shop view)
                            const limitReached = hasPurchasedUpgradeThisRound;

                            return (
                                <div key={upgrade.id} className="relative">
                                    <UpgradeCard
                                        upgrade={upgrade}
                                        onAction={() => buyUpgrade(upgrade)}
                                        // Shop logic: Check money and lock status. Also check limit.
                                        canAfford={money >= upgrade.cost && !limitReached}
                                        isLocked={isLocked}
                                    />
                                    {limitReached && (
                                        <div className="absolute inset-0 bg-slate-900/60 z-30 flex items-center justify-center rounded-xl pointer-events-none">
                                            <span className="text-white font-bold text-xs uppercase bg-black/50 px-2 py-1 rounded">Round Limit Reached</span>
                                        </div>
                                    )}
                                </div>
                            );
                        })
                    ) : (
                        <div className="text-gray-500 italic">No Upgrades Available</div>
                    )}
                </div>
            </div>

            <GameButton
                variant="success"
                size="lg"
                onClick={advanceStage}
            >
                CONTINUE
            </GameButton>
        </div>
    );
};

export const EventView = () => {
    const advanceStage = useGameStore((state) => state.advanceStage);

    return (
        <div className="flex flex-col items-center justify-center min-h-[60vh] text-white">
            <h2 className="text-4xl font-bold text-purple-500 mb-8">Event</h2>
            <div className="bg-gray-700 p-8 rounded-xl max-w-md text-center mb-8">
                <p className="text-xl mb-4">Random Event!</p>
                <p className="text-gray-400">Something mysterious happens...</p>
            </div>
            <GameButton
                variant="warning" // Purple variant not defined in GameButton yet, defaulting/using closest or adding it? 
                // Wait, I should add purple or just use primary? Let's use primary for now or add styling. 
                // Actually the user asked for specific colors. Let's start with a basic one.
                className="bg-purple-600 hover:bg-purple-500 border-purple-800"
                onClick={advanceStage}
            >
                Continue
            </GameButton>
        </div>
    );
};
