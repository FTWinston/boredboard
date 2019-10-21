import { MoveType } from './MoveType';
import { PieceActionCondition } from './PieceActionCondition';
import { GameDefinition } from './GameDefinition';
import { IPlayerAction } from '../instances/IPlayerAction';
import { IGameState } from '../instances/IGameState';

interface IPieceActionElement {
    readonly directions: ReadonlyArray<string>;
    readonly minDistance: number;
    readonly maxDistance?: number;
    readonly optional: boolean;
}

export class PieceActionDefinition {
    constructor(readonly moveType: MoveType, readonly moveSequence: ReadonlyArray<IPieceActionElement>, readonly conditions: PieceActionCondition[]) {
        
    }

    public getPossibleActions(game: GameDefinition, state: IGameState, board: string, cell: string, piece: number) {
        const boardDef = game.boards.get(board);
        if (boardDef === undefined) {
            return [];
        }

        const boardState = state.boards[board];
        if (boardState === undefined) {
            return [];
        }

        const fromCellContent = boardState.cellContents[cell];
        if (fromCellContent === undefined) {
            return [];
        }

        const pieceData = fromCellContent.find(p => p.id === piece);

        if (pieceData === undefined) {
            return [];
        }

        const actions: IPlayerAction[] = [];

        let previousDirection: string | null = null;

        for (const actionElement of this.moveSequence) {
            for (const direction of actionElement.directions) {
                const actualDirections = boardDef.resolveDirection(direction, pieceData.owner, previousDirection);

                // TODO: trace in these directions for the approriate distances
            }
        }

        return actions;
    }
}