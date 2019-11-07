import { PieceActionDefinition } from './PieceActionDefinition';
import { GameDefinition } from './GameDefinition';
import { IGameState } from '../instances/IGameState';
import { IPlayerAction } from '../instances/IPlayerAction';

export class PieceDefinition {
    public readonly actions: ReadonlyArray<PieceActionDefinition>;

    constructor(private readonly game: GameDefinition, readonly value: number, actions: PieceActionDefinition[]) {
        this.actions = actions;
    }

    public getPossibleActions(state: IGameState, board: string, cell: string, piece: string) {
        let actions: IPlayerAction[] = [];

        for (const action of this.actions) {
            actions = [
                ...actions,
                ...action.getPossibleActions(state, board, cell, piece),
            ]
        }
        
        return actions;
    }
}