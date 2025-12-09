import { GameState } from '../store/useGameStore';

export type UpgradeType = 'BASE' | 'DEPENDENT';

export interface Upgrade {
    id: string;
    name: string;
    description: string;
    cost: number;
    type: UpgradeType;
    baseUpgradeId?: string; // If dependent, which base upgrade it needs
    imageSrc?: string; // User requested image support
    // Optional hook for immediate effects (e.g., +Hands, +Discards immediate grant? 
    // Usually persistent effects are read from state, but this could run once on buy)
    onBuy?: (store: GameState) => void;
}
