import React, { useState } from 'react';
import { useProfileStore } from '../store/useProfileStore';
import { useGameStore } from '../store/useGameStore';

export default function StartScreen() {
    const [name, setName] = useState('');
    const createProfile = useProfileStore((state) => state.createProfile);
    const goToMenu = useGameStore((state) => state.goToMenu);

    const handleContinue = () => {
        if (name.trim().length > 0) {
            createProfile(name.trim());
            goToMenu();
        }
    };

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-slate-900 text-white gap-8 p-4">
            <div className="text-6xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-600">
                ROGUE LEXIS
            </div>

            <div className="flex flex-col items-center gap-4 w-full max-w-md">
                <h2 className="text-2xl font-light">
                    Welcome, <span className="font-bold text-blue-300">{name || '...'}</span>
                </h2>

                <div className="w-full flex flex-col gap-2">
                    <label htmlFor="name-input" className="text-sm text-slate-400 uppercase tracking-widest">
                        Your Name
                    </label>
                    <input
                        id="name-input"
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="w-full bg-slate-800 border-2 border-slate-700 rounded-lg p-4 text-xl text-center focus:border-blue-500 focus:outline-none transition-colors"
                        placeholder="Enter your name..."
                        autoComplete="off"
                        autoFocus
                    />
                </div>

                {name.trim().length > 0 && (
                    <button
                        onClick={handleContinue}
                        className="w-full bg-blue-600 hover:bg-blue-500 text-white font-bold py-4 rounded-lg shadow-lg transform transition-all hover:-translate-y-1 active:translate-y-0"
                    >
                        Continue
                    </button>
                )}
            </div>
        </div>
    );
}
