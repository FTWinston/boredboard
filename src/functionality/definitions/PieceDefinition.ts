import { PieceActionDefinition } from './PieceActionDefinition';
import { GameDefinition } from './GameDefinition';
import { IGameState } from '../instances';
import { IPlayerAction } from '../instances/IPlayerAction';

export class PieceDefinition {
    public readonly actions: ReadonlyArray<PieceActionDefinition>;

    constructor(readonly value: number, actions: PieceActionDefinition[]) {
        this.actions = actions;
    }

    public getPossibleActions(game: GameDefinition, state: IGameState, board: string, cell: string, id: number) {
        let actions: IPlayerAction[] = [];

        for (const action of this.actions) {
            actions = [
                ...actions,
                ...action.getPossibleActions(game, state, board, cell, id),
            ]
        }
        
        return actions;
    }
}