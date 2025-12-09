'use client';

import React from 'react';
import UpgradeCard from '../components/UpgradeCard';
import { UPGRADES } from '../data/upgrades';

export default function SandboxPage() {
    return (
        <div className="p-8 bg-slate-200 min-h-screen">
            <h1 className="text-2xl font-bold mb-4">Upgrade Feature Sandbox</h1>

            <div className="flex gap-4 mb-8">
                <div>
                    <h2 className="mb-2 font-bold">Base Upgrade (Unowned)</h2>
                    <UpgradeCard
                        upgrade={UPGRADES['wasteful']}
                        onAction={() => alert('Buy Wasteful!')}
                        isPurchased={false}
                        canAfford={true}
                    />
                </div>

                <div>
                    <h2 className="mb-2 font-bold">Base Upgrade (Owned)</h2>
                    <UpgradeCard
                        upgrade={UPGRADES['wasteful']}
                        onAction={() => { }}
                        isPurchased={true}
                        canAfford={true}
                    />
                </div>

                <div>
                    <h2 className="mb-2 font-bold">Dependent Upgrade (Locked)</h2>
                    <UpgradeCard
                        upgrade={UPGRADES['recycling']}
                        onAction={() => { }}
                        isPurchased={false}
                        canAfford={true}
                        isLocked={true}
                    />
                </div>

                <div>
                    <h2 className="mb-2 font-bold">Dependent Upgrade (Unlocked)</h2>
                    <UpgradeCard
                        upgrade={UPGRADES['recycling']}
                        onAction={() => alert('Buy Recycling!')}
                        isPurchased={false}
                        canAfford={true}
                        isLocked={false}
                    />
                </div>
            </div>

            <p className="max-w-md text-sm text-gray-600">
                This sandbox demonstrates the visual states of upgrades: Available, Purchased, Locked, and Unlocked.
                Logic for checking dependencies will be handled in the store.
            </p>
        </div>
    );
}
