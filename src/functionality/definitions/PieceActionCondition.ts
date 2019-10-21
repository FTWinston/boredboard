import { IPlayerAction } from '../instances/IPlayerAction';
import { IGameState } from '../instances';
import { GameDefinition } from './GameDefinition';

export class PieceActionCondition {
    constructor(readonly attacking?: boolean) {
        
    }

    public isValid(action: IPlayerAction, game: GameDefinition, state: IGameState): boolean {
        return true; // TODO: determine if this condition is satisfied
    }
}