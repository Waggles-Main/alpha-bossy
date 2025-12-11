import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Profile } from '../types/Profile';
import { useGameStore } from './useGameStore'; // Import game store to reset it when switching profiles

interface ProfileState {
    profiles: Record<string, Profile>;
    activeProfileId: string | null;

    createProfile: (name: string) => void;
    setActiveProfile: (id: string) => void;
    deleteProfile: (id: string) => void;
    resetProfile: (id: string) => void;
    incrementRuns: (id: string) => void;
    incrementWins: (id: string) => void;

    // Helper to get active profile object safely
    getActiveProfile: () => Profile | null;
}

export const useProfileStore = create<ProfileState>()(
    persist(
        (set, get) => ({
            profiles: {},
            activeProfileId: null,

            createProfile: (name: string) => {
                const id = crypto.randomUUID();
                const newProfile: Profile = {
                    id,
                    name,
                    wins: 0,
                    runs: 0,
                    createdAt: Date.now(),
                    lastPlayed: Date.now(),
                };

                set((state) => ({
                    profiles: { ...state.profiles, [id]: newProfile },
                    activeProfileId: id,
                }));
            },

            setActiveProfile: (id: string) => {
                set((state) => {
                    // Update lastPlayed when switching
                    const profile = state.profiles[id];
                    if (!profile) return {};

                    return {
                        activeProfileId: id,
                        profiles: {
                            ...state.profiles,
                            [id]: { ...profile, lastPlayed: Date.now() }
                        }
                    }
                });
            },

            deleteProfile: (id: string) => {
                set((state) => {
                    const newProfiles = { ...state.profiles };
                    delete newProfiles[id];
                    return {
                        profiles: newProfiles,
                        activeProfileId: state.activeProfileId === id ? null : state.activeProfileId,
                    };
                });
            },

            resetProfile: (id: string) => {
                set((state) => {
                    const profile = state.profiles[id];
                    if (!profile) return {};

                    return {
                        profiles: {
                            ...state.profiles,
                            [id]: {
                                ...profile,
                                wins: 0,
                                runs: 0,
                                // keep name, created at, etc
                            },
                        },
                    };
                });
            },

            incrementRuns: (id: string) => {
                set((state) => {
                    const profile = state.profiles[id];
                    if (!profile) return {};
                    return {
                        profiles: {
                            ...state.profiles,
                            [id]: { ...profile, runs: profile.runs + 1 }
                        }
                    }
                });
            },

            incrementWins: (id: string) => {
                set((state) => {
                    const profile = state.profiles[id];
                    if (!profile) return {};
                    return {
                        profiles: {
                            ...state.profiles,
                            [id]: { ...profile, wins: profile.wins + 1 }
                        }
                    }
                });
            },

            getActiveProfile: () => {
                const { profiles, activeProfileId } = get();
                if (!activeProfileId) return null;
                return profiles[activeProfileId] || null;
            }
        }),
        {
            name: 'rogue-lexis-profiles', // unique name for localStorage
        }
    )
);
