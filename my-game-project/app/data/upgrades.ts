import { Upgrade } from '../types/Upgrade';

export const UPGRADES: Record<string, Upgrade> = {
    'glyph_slot': {
        id: 'glyph_slot',
        name: 'Glyph',
        description: '+1 Glyph slot',
        cost: 10,
        type: 'BASE',
        imageSrc: '/assets/upgrades/glyph.png'
    },
    'glyph_slot_plus': {
        id: 'glyph_slot_plus',
        name: 'Glyph Plus',
        description: '+2 Glyph slot',
        cost: 10,
        type: 'DEPENDENT',
        baseUpgradeId: 'glyph_slot',
        imageSrc: '/assets/upgrades/glyph-plus.png'
    },
    'overstock': {
        id: 'overstock',
        name: 'Overstock',
        description: '+1 option in shop (3 total)',
        cost: 10,
        type: 'BASE',
        imageSrc: '/assets/upgrades/overstock.png'
    },
    'overstock_plus': {
        id: 'overstock_plus',
        name: 'Overstock Plus',
        description: '+1 tile slot available in shop (4 total)',
        cost: 10,
        type: 'DEPENDENT',
        baseUpgradeId: 'overstock',
        imageSrc: '/assets/upgrades/overstock-plus.png'
    },
    'reroll': {
        id: 'reroll',
        name: 'Reroll',
        description: 'Rerolls cost $2 less',
        cost: 10,
        type: 'BASE',
        imageSrc: '/assets/upgrades/reroll.png'
    },
    'reroll_plus': {
        id: 'reroll_plus',
        name: 'Reroll Plus',
        description: 'Rerolls cost an additional $2 less',
        cost: 10,
        type: 'DEPENDENT',
        baseUpgradeId: 'reroll',
        imageSrc: '/assets/upgrades/reroll-plus.png'
    },
    'verbose': {
        id: 'verbose',
        name: 'Verbose',
        description: 'Word length scoring starts 1 slot earlier (at 5)',
        cost: 20,
        type: 'BASE',
        imageSrc: '/assets/upgrades/verbose.png'
    },
    'verbose_plus': {
        id: 'verbose_plus',
        name: 'Verbose Plus',
        description: 'Word length scoring starts 1 slot earlier (at 4)',
        cost: 20,
        type: 'DEPENDENT',
        baseUpgradeId: 'verbose',
        imageSrc: '/assets/upgrades/verbose-plus.png'
    },
    'wasteful': {
        id: 'wasteful',
        name: 'Wasteful',
        description: 'Permanently gain +1 discard each round',
        cost: 10,
        type: 'BASE',
        imageSrc: '/assets/upgrades/wasteful.png'
    },
    'wasteful_plus': {
        id: 'wasteful_plus',
        name: 'Wasteful Plus',
        description: 'Permanently gain an additional +1 discard each round',
        cost: 10,
        type: 'DEPENDENT',
        baseUpgradeId: 'wasteful',
        imageSrc: '/assets/upgrades/wasteful-plus.png'
    },
    'wordy': {
        id: 'wordy',
        name: 'Wordy',
        description: 'Permanently gain +1 word per round',
        cost: 10,
        type: 'BASE',
        imageSrc: '/assets/upgrades/wordy.png'
    },
    'wordy_plus': {
        id: 'wordy_plus',
        name: 'Wordy Plus',
        description: 'Permanently gain an additional +1 word per round',
        cost: 10,
        type: 'DEPENDENT',
        baseUpgradeId: 'wordy',
        imageSrc: '/assets/upgrades/wordy-plus.png'
    }
};
