import React, { useState } from 'react';
import { useProfileStore } from '../store/useProfileStore';
import { useGameStore } from '../store/useGameStore';

interface Props {
    onClose: () => void;
}

export default function ProfileModal({ onClose }: Props) {
    const { profiles, activeProfileId, createProfile, setActiveProfile, deleteProfile, resetProfile } = useProfileStore();
    const goToStartScreen = useGameStore(state => state.goToStartScreen);
    const [isCreating, setIsCreating] = useState(false);
    const [newName, setNewName] = useState('');

    // Confirmation State
    const [confirmation, setConfirmation] = useState<{ type: 'DELETE' | 'RESET', profileId: string } | null>(null);

    const profileList = Object.values(profiles);
    const canCreate = profileList.length < 3;

    const handleCreate = () => {
        if (newName.trim()) {
            createProfile(newName.trim());
            setIsCreating(false);
            setNewName('');
        }
    };

    const handleSelect = (id: string) => {
        setActiveProfile(id);
        onClose();
    };

    // Trigger Confirmations
    const requestDelete = (id: string) => {
        setConfirmation({ type: 'DELETE', profileId: id });
    }

    const requestReset = (id: string) => {
        setConfirmation({ type: 'RESET', profileId: id });
    }

    // Execute Actions
    const confirmAction = () => {
        if (!confirmation) return;

        if (confirmation.type === 'DELETE') {
            deleteProfile(confirmation.profileId);
            if (activeProfileId === confirmation.profileId) {
                goToStartScreen();
            }
        } else if (confirmation.type === 'RESET') {
            resetProfile(confirmation.profileId);
        }
        setConfirmation(null);
    };

    const cancelAction = () => {
        setConfirmation(null);
    }

    return (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">

            {/* Confirmation Overlay */}
            {confirmation && (
                <div className="absolute inset-0 z-50 bg-black/90 flex items-center justify-center p-6 animate-in fade-in rounded-xl">
                    <div className="bg-slate-800 border-2 border-slate-600 rounded-xl p-6 w-full max-w-sm text-center shadow-2xl">
                        <h3 className="text-xl font-bold text-white mb-4">
                            {confirmation.type === 'DELETE' ? 'Delete Profile?' : 'Reset Profile?'}
                        </h3>
                        <p className="text-slate-300 mb-8">
                            {confirmation.type === 'DELETE'
                                ? "This will delete the profile."
                                : "This will remove all progression."}
                        </p>
                        <div className="flex gap-4">
                            <button
                                onClick={confirmAction}
                                className="flex-1 bg-red-600 hover:bg-red-500 text-white font-bold py-3 rounded-lg"
                            >
                                Yes
                            </button>
                            <button
                                onClick={cancelAction}
                                className="flex-1 bg-slate-600 hover:bg-slate-500 text-white font-bold py-3 rounded-lg"
                            >
                                No
                            </button>
                        </div>
                    </div>
                </div>
            )}

            <div className="bg-slate-800 border-2 border-slate-600 rounded-xl p-6 w-full max-w-lg shadow-2xl relative overflow-hidden">
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-3xl font-bold text-white">Profiles</h2>
                    <button onClick={onClose} className="text-slate-400 hover:text-white text-xl">✕</button>
                </div>

                <div className="flex flex-col gap-4 mb-6">
                    {profileList.map((profile) => (
                        <div
                            key={profile.id}
                            className={`p-4 rounded-lg border-2 flex justify-between items-center transition-all ${activeProfileId === profile.id
                                ? 'bg-blue-900/40 border-blue-500 shadow-blue-500/20 shadow-lg'
                                : 'bg-slate-700/50 border-slate-600 hover:border-slate-500'
                                }`}
                        >
                            <div className="flex flex-col">
                                <span className="text-xl font-bold text-white">{profile.name}</span>
                                <span className="text-sm text-slate-400">Wins: {profile.wins} | Runs: {profile.runs}</span>
                            </div>

                            <div className="flex gap-2">
                                {activeProfileId !== profile.id && (
                                    <button
                                        onClick={() => handleSelect(profile.id)}
                                        className="px-3 py-1 bg-green-700 hover:bg-green-600 text-white rounded text-sm font-bold"
                                    >
                                        Select
                                    </button>
                                )}
                                <button
                                    onClick={() => requestReset(profile.id)}
                                    className="px-3 py-1 bg-slate-600 hover:bg-slate-500 text-white rounded text-sm"
                                >
                                    Reset
                                </button>
                                <button
                                    onClick={() => requestDelete(profile.id)}
                                    className="px-3 py-1 bg-red-800 hover:bg-red-700 text-white rounded text-sm"
                                >
                                    Delete
                                </button>
                            </div>
                        </div>
                    ))}

                    {profileList.length === 0 && (
                        <div className="text-center text-slate-500 py-8">No profiles found.</div>
                    )}
                </div>

                {canCreate && !isCreating && (
                    <button
                        onClick={() => setIsCreating(true)}
                        className="w-full border-2 border-dashed border-slate-600 text-slate-400 p-4 rounded-lg hover:border-slate-400 hover:text-white transition-colors"
                    >
                        + Create New Profile
                    </button>
                )}

                {isCreating && (
                    <div className="flex gap-2 items-center bg-slate-700 p-4 rounded-lg animate-in fade-in slide-in-from-top-2">
                        <input
                            type="text"
                            value={newName}
                            onChange={(e) => setNewName(e.target.value)}
                            className="flex-1 bg-slate-800 border border-slate-600 rounded px-3 py-2 text-white focus:border-blue-500 focus:outline-none"
                            placeholder="New profile name..."
                            autoFocus
                        />
                        <button
                            onClick={handleCreate}
                            className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded font-bold"
                        >
                            Create
                        </button>
                        <button
                            onClick={() => setIsCreating(false)}
                            className="px-4 py-2 bg-slate-600 hover:bg-slate-500 text-white rounded"
                        >
                            Cancel
                        </button>
                    </div>
                )}

                <div className="mt-6 pt-6 border-t border-slate-700 flex justify-end">
                    <button onClick={onClose} className="text-slate-300 hover:text-white font-medium">Close</button>
                </div>
            </div>
        </div>
    );
}
