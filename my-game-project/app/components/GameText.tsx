'use client';

import React from 'react';
import { clsx } from 'clsx';

interface GameTextProps {
    text: string;
    className?: string; // Base class for the wrapper
}

const GameText: React.FC<GameTextProps> = ({ text, className }) => {
    // We want to split the text by our key patterns so we can wrap them.
    // Patterns:
    // 1. "+[Number] Mult" -> Red
    // 2. "+[Number] Points" or "Chips" -> Blue
    // 3. "x[Number] Mult" -> Purple
    // 4. "$[Number]" -> Yellow
    // 5. "Mult" (standalone) -> Red
    // 6. "Points" or "Chips" (standalone) -> Blue

    // Regex Explanation:
    // We capture the groups to keep them in the split array.
    // Order matters! More specific patterns first.

    const parts = text.split(/(\+\d+\s*Mult)|(\+\d+\s*(?:Points|Chips))|(x\d+(?:\.\d+)?\s*Mult)|(\$\d+)|(\bMult\b)|(\bPoints\b|\bChips\b)/g);

    return (
        <span className={className}>
            {parts.map((part, i) => {
                if (!part) return null;

                // +X Mult
                if (/^\+\d+\s*Mult$/.test(part)) {
                    return <span key={i} className="font-bold text-red-500">{part}</span>;
                }
                // +X Points/Chips
                if (/^\+\d+\s*(?:Points|Chips)$/.test(part)) {
                    return <span key={i} className="font-bold text-blue-400">{part}</span>;
                }
                // xX Mult
                if (/^x\d+(?:\.\d+)?\s*Mult$/.test(part)) {
                    return <span key={i} className="font-bold text-purple-400">{part}</span>;
                }
                // $X
                if (/^\$\d+$/.test(part)) {
                    return <span key={i} className="font-bold text-yellow-400">{part}</span>;
                }

                // Standalone Keywords (Fallback if not caught in number combo)
                if (part === 'Mult') {
                    return <span key={i} className="font-bold text-red-500">{part}</span>;
                }
                if (part === 'Points' || part === 'Chips') {
                    return <span key={i} className="font-bold text-blue-400">{part}</span>;
                }

                // Plain text
                return <span key={i}>{part}</span>;
            })}
        </span>
    );
};

export default GameText;
