import React from 'react';
import { useGameStore } from '../store/useGameStore';

import { GameButton } from './GameButton';
import GlyphCard from './GlyphCard';
import GlyphArea from './GlyphArea';

export const ShopView = () => {
    const { advanceStage, money, rerollShop, shopItems, buyGlyph } = useGameStore();

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
                    disabled={money < 5}
                    className="w-full"
                >
                    REROLL $5
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
                <div className="grid grid-cols-2 gap-4">
                    {[1, 2].map((i) => (
                        <div key={i} className="aspect-square bg-white border border-slate-900 flex flex-col items-center justify-between p-2 text-xs font-bold shadow-sm hover:shadow-md transition-shadow cursor-pointer">
                            <div className="text-center leading-none">
                                <div>VOUCHER</div>
                                <div className="text-slate-500 text-[0.6rem]">TYPE</div>
                            </div>
                            <div className="w-full h-8 bg-slate-200" /> {/* Graphic Placeholder */}
                            <div className="text-orange-500">$10</div>
                        </div>
                    ))}
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
