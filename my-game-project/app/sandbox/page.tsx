'use client';

import React from 'react';
import Link from 'next/link';
import GlyphCard from '../components/GlyphCard';
import { GLYPHS } from '../data/glyphs';

const SandboxPage = () => {


    return (
        <div className="min-h-screen bg-gray-900 text-white p-8 font-sans">
            <div className="max-w-6xl mx-auto">
                <header className="flex justify-between items-center mb-8 border-b border-gray-700 pb-4">
                    <h1 className="text-3xl font-bold text-blue-400">Developer Sandbox</h1>
                    <Link
                        href="/"
                        className="px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded text-sm transition-colors"
                    >
                        ← Back to Game
                    </Link>
                </header>

                <section className="mb-12">
                    <h2 className="text-xl font-semibold mb-6 text-gray-300">Glyph Registry (Real Data)</h2>
                    <p className="text-gray-400 mb-8 italic">Verified implementation of Big A and Little A.</p>

                    <div className="flex flex-wrap gap-16 justify-center items-start">

                        {/* Big A Card */}
                        <div className="flex flex-col items-center">
                            <GlyphCard
                                glyph={GLYPHS.BIG_A}
                                currentStats={{ mult: 0 }} // Logic not hooked to store yet
                                onSell={() => alert(`Sell for $${GLYPHS.BIG_A.sellValue}`)}
                            />
                        </div>

                        {/* Little A Card */}
                        <div className="flex flex-col items-center">
                            <GlyphCard
                                glyph={GLYPHS.LITTLE_A}
                                currentStats={{ points: 0 }} // Logic not hooked to store yet
                                onSell={() => alert(`Sell for $${GLYPHS.LITTLE_A.sellValue}`)}
                            />
                        </div>

                    </div>
                </section>

                <section className="p-4 bg-blue-900/20 border border-blue-900 rounded text-sm text-blue-200 mt-20">
                    <p>This sandbox now displays the <strong>Official Glyph Definitions</strong> from <code>app/data/glyphs.ts</code>.</p>
                </section>
            </div>
        </div>
    );
};

export default SandboxPage;
