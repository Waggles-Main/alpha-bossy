'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { clsx } from 'clsx';
import { Glyph, GlyphStats } from '../types/Glyph';
import GameText from './GameText';

interface GlyphCardProps {
    glyph: Glyph;
    currentStats?: GlyphStats; // Optional stats for the bottom tooltip
    onSell?: () => void;
    onAction?: () => void;
    isInteractive?: boolean;
    price?: number;
    isShopItem?: boolean;
}

const GlyphCard: React.FC<GlyphCardProps> = ({
    glyph,
    currentStats,
    onSell,
    onAction,
    isInteractive = true,
    price,
    isShopItem = false
}) => {
    const [isHovered, setIsHovered] = useState(false);
    const [isSelected, setIsSelected] = useState(false);

    // Toggle selection on click, but only if interactive
    // Shop items: Click does NOTHING (bought via button only)
    const handleClick = (e: React.MouseEvent) => {
        if (!isInteractive) return;

        if (isShopItem) {
            // Prevent buying on card body click. 
            // Only the button triggers the action.
            return;
        }

        setIsSelected(!isSelected);
    };

    const showOverlay = isHovered || isSelected || isShopItem;

    // For Shop items, we might want the overlay always legally visible? 
    // Or just on hover? The design says "Persistent tool tip with button".
    // The "Overlay" contains name/desc. 
    // The "Button" is separate.
    // Let's keep overlay on Hover for shop items to keep it clean, 
    // but the Button is always visible.

    const showCardOverlay = (isHovered || isSelected) && !isShopItem;
    // Actually, let's allow hover overlay in shop too, so you can read what it does.
    const effectiveShowOverlay = showCardOverlay || (isHovered && isShopItem);


    return (
        <div className="relative inline-block m-4 select-none">

            {/* Top Action Button: Sell (Standard) or BUY (Shop) */}
            {/* Shop: Always visible. Standard: Only when selected. */}

            {/* BUY BUTTON */}
            {isShopItem && (
                <div className="absolute -top-12 left-1/2 transform -translate-x-1/2 z-20 w-full px-2" style={{ width: '140%' }}>
                    <button
                        onClick={(e) => { e.stopPropagation(); onAction?.(); }}
                        className="w-full bg-yellow-400 hover:bg-yellow-300 text-black font-black uppercase py-2 px-1 rounded-lg border-2 border-black shadow-[0_4px_0_rgba(0,0,0,1)] active:shadow-none active:translate-y-1 text-lg whitespace-nowrap flex items-center justify-center gap-1"
                    >
                        <span>BUY</span>
                        <span>${price || glyph.baseCost || 0}</span>
                    </button>
                </div>
            )}

            {/* SELL BUTTON */}
            {!isShopItem && isSelected && (
                <div className="absolute -top-12 left-1/2 transform -translate-x-1/2 z-30 w-full px-2">
                    <button
                        onClick={(e) => { e.stopPropagation(); onSell?.(); }}
                        className="w-full bg-yellow-400 hover:bg-yellow-300 text-black font-bold uppercase py-1 px-2 rounded border-2 border-black shadow-lg text-sm whitespace-nowrap transition-transform active:scale-95"
                    >
                        Sell ${glyph.sellValue}
                    </button>
                </div>
            )}

            {/* Main Card Area */}
            <div
                className={clsx(
                    "relative w-32 h-44 rounded-xl transition-all duration-200 ease-in-out cursor-pointer",
                    "bg-gray-100 shadow-xl border-4 text-center flex items-center justify-center", // Base styling
                    {
                        'scale-110 z-10 box-decoration-clone ring-4 ring-yellow-400': isSelected, // Selected state highlight
                        'hover:scale-105 z-10': isHovered && !isSelected, // Hover scale
                        'border-gray-300': !isSelected,
                        'border-yellow-500': isSelected
                    }
                )}
                onMouseEnter={() => setIsHovered(true)}
                onMouseLeave={() => setIsHovered(false)}
                onClick={handleClick}
            >
                {/* Main Image */}
                <div className="relative w-full h-full p-2">
                    <Image
                        src={glyph.imageSrc}
                        alt={glyph.name}
                        fill
                        className="object-contain" // Keep aspect ratio but fit nicely in the padded box
                    />
                </div>

                {/* Overlay details (Name, Desc, Rarity) */}
                {effectiveShowOverlay && (
                    <div className="absolute inset-0 bg-black/80 rounded-lg flex flex-col justify-between p-2 text-white animate-in fade-in duration-150 z-20 pointer-events-none">
                        {/* Header Content */}
                        <div className="flex flex-col items-center text-center">
                            <h3 className="font-bold text-lg leading-tight mb-1">{glyph.name}</h3>
                            <div className="font-bold text-xs uppercase mb-1">
                                <GameText text={glyph.effectDescription} />
                            </div>
                            <div className="text-gray-300 text-xs leading-snug">
                                <GameText text={glyph.description} />
                            </div>
                        </div>

                        {/* Footer / Rarity Badge */}
                        <div className="mt-auto pt-2">
                            <div className={clsx(
                                "w-full text-center text-xs font-bold uppercase py-1 rounded",
                                {
                                    'bg-gray-500 text-white': glyph.rarity === 'Common',
                                    'bg-green-500 text-white': glyph.rarity === 'Uncommon',
                                    'bg-yellow-500 text-black': glyph.rarity === 'Rare',
                                    'bg-purple-500 text-white': glyph.rarity === 'Legendary',
                                }
                            )}>
                                {glyph.rarity}
                            </div>
                        </div>
                    </div>
                )}
            </div>

            {/* Bottom Stats Tooltip */}
            {isHovered && !isSelected && currentStats && !isShopItem && (
                <div className="absolute -bottom-16 left-1/2 transform -translate-x-1/2 z-50 w-32 bg-gray-900/95 border-2 border-slate-600 rounded-lg p-2 text-center shadow-2xl animate-in slide-in-from-top-2 duration-150 pointer-events-none">
                    {currentStats.points && <div className="text-blue-400 font-bold text-lg drop-shadow-md">+{currentStats.points} Points</div>}
                    {currentStats.mult && <div className="text-red-500 font-bold text-lg drop-shadow-md">+{currentStats.mult} Mult</div>}
                    {currentStats.xMult && <div className="text-purple-400 font-bold text-lg drop-shadow-md">x{currentStats.xMult} Mult</div>}
                    {currentStats.money && <div className="text-yellow-400 font-bold text-lg drop-shadow-md">+${currentStats.money}</div>}
                </div>
            )}

            {/* Bottom Action Button (Inventory Item Clicked) - ONLY IF ACTION EXISTS */}
            {!isShopItem && isSelected && glyph.description.includes('Action') && (
                <div className="absolute -bottom-12 left-1/2 transform -translate-x-1/2 z-30 w-full px-2">
                    <button
                        onClick={(e) => { e.stopPropagation(); onAction?.(); }}
                        className="w-full bg-green-500 hover:bg-green-400 text-white font-bold uppercase py-1 px-2 rounded border-2 border-black shadow-lg text-sm transition-transform active:scale-95"
                    >
                        USE
                    </button>
                </div>
            )}

        </div>
    );
};

export default GlyphCard;
