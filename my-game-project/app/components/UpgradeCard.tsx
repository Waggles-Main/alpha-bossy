'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { clsx } from 'clsx';
import { Upgrade } from '../types/Upgrade';
import GameText from './GameText';

interface UpgradeCardProps {
    upgrade: Upgrade;
    onAction?: () => void;
    isPurchased?: boolean;
    canAfford?: boolean;
    isLocked?: boolean; // For dependent upgrades if base not owned
}

const UpgradeCard: React.FC<UpgradeCardProps> = ({
    upgrade,
    onAction,
    isPurchased = false,
    canAfford = true,
    isLocked = false
}) => {
    const [isHovered, setIsHovered] = useState(false);

    // Reusing the "GlyphCard" aesthetic (Gray box, yellow/black accents)
    // but tailored for Upgrades (Vouchers)

    return (
        <div className="relative inline-block m-2 select-none">

            {/* BUY BUTTON - Only if not purchased and not locked */}
            {!isPurchased && !isLocked && (
                <div className="absolute -top-10 left-1/2 transform -translate-x-1/2 z-20 w-32 px-1">
                    <button
                        onClick={(e) => { e.stopPropagation(); if (canAfford) onAction?.(); }}
                        disabled={!canAfford}
                        className={clsx(
                            "w-full font-black uppercase py-1 px-1 rounded-lg border-2 border-black shadow-[0_3px_0_rgba(0,0,0,1)] active:shadow-none active:translate-y-1 text-sm whitespace-nowrap flex items-center justify-center gap-1",
                            canAfford ? "bg-orange-400 hover:bg-orange-300 text-black" : "bg-gray-400 text-gray-600 cursor-not-allowed"
                        )}
                    >
                        <span>BUY</span>
                        <span>${upgrade.cost}</span>
                    </button>
                </div>
            )}

            {/* PURCHASED BADGE */}
            {isPurchased && (
                <div className="absolute -top-3 left-1/2 transform -translate-x-1/2 z-20 w-full text-center">
                    <span className="bg-green-500 text-white font-bold text-xs px-2 py-0.5 rounded shadow-sm border border-black">
                        OWNED
                    </span>
                </div>
            )}

            {/* LOCKED BADGE (Optional visual) */}
            {isLocked && (
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-20 w-full text-center">
                    <div className="text-4xl">🔒</div>
                </div>
            )}

            {/* Main Card Area */}
            <div
                className={clsx(
                    "relative w-32 h-32 rounded-xl transition-all duration-200 ease-in-out cursor-default",
                    "bg-slate-100 shadow-md border-4 text-center flex items-center justify-center overflow-hidden",
                    {
                        'border-slate-800': !isPurchased,
                        'border-green-600 bg-green-50': isPurchased, // Green border if owned
                        'opacity-50': isLocked // Dim if locked
                    }
                )}
                onMouseEnter={() => setIsHovered(true)}
                onMouseLeave={() => setIsHovered(false)}
            >
                {/* Visual Placeholder or Image */}
                {upgrade.imageSrc ? (
                    <div className="relative w-full h-full p-2">
                        <Image
                            src={upgrade.imageSrc}
                            alt={upgrade.name}
                            fill
                            className="object-contain"
                        />
                    </div>
                ) : (
                    <div className="absolute inset-2 border-2 border-dashed border-slate-300 rounded flex items-center justify-center text-slate-300 font-bold uppercase tracking-widest text-xs">
                        IMG
                    </div>
                )}


                {/* Overlay details (Always visible or on hover? Designs usually have text on vouchers) */}
                {/* Let's show Name always, Desc on hover? Or mimic GlyphCard exactly? */}
                {/* GlyphCard shows details on Hover for shop items. */}

                <div className={clsx(
                    "absolute inset-0 bg-black/80 flex flex-col justify-between p-2 text-white text-center transition-opacity duration-150 z-10",
                    isHovered ? "opacity-100" : "opacity-0" // Hide when not hovered unless we want it always
                )}>
                    <div>
                        <div className="text-xs text-orange-400 font-bold uppercase mb-1">{upgrade.type}</div>
                        <h3 className="font-bold text-sm leading-tight mb-2">{upgrade.name}</h3>
                        <div className="text-[0.65rem] leading-snug text-gray-200">
                            <GameText text={upgrade.description} />
                        </div>
                    </div>
                </div>

                {/* Non-hover Name Label (so it's not just a blank box) */}
                <div className={clsx("absolute bottom-0 w-full bg-slate-800 text-white text-[0.6rem] font-bold py-1 uppercase truncate px-1", isHovered && "opacity-0")}>
                    {upgrade.name}
                </div>

            </div>
        </div>
    );
};

export default UpgradeCard;
