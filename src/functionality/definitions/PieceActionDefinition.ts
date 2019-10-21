import { MoveType } from './MoveType';
import { IPieceActionCondition } from './IPieceActionCondition';
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
    constructor(readonly moveType: MoveType, readonly moveSequence: ReadonlyArray<IPieceActionElement>, readonly conditions: ReadonlyArray<IPieceActionCondition>) {
        
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

        for (const condition of this.conditions) {
            if (!condition.isStateValid(game, state, boardState, cell, pieceData)) {
                return [];
            }
        }

        const actions: IPlayerAction[] = [];

        let previousDirection: string | null = null;

        for (const element of this.moveSequence) {
            for (const direction of element.directions) {
                const linkTypes = boardDef.resolveDirection(direction, pieceData.owner, previousDirection);

                for (const linkType of linkTypes) {
                    const destCells = boardDef.traceLink(cell, linkType, element.minDistance, element.maxDistance);

                    for (const destCell of destCells) {
                        // TODO: this only works for single step sequences. Extend it to work with multi-step...
                        // Need to save off all intermediate states after each step (including prev dir for each)
                        // ... then apply subsequent steps to each.

                        const action: IPlayerAction = {
                            pieceMovement: [{
                                piece: piece,
                                fromBoard: board,
                                toBoard: board,
                                fromCell: cell,
                                toCell: destCell,
                            }]
                        }

                        let allValid = true;
                        for (const condition of this.conditions) {
                            if (!condition.isActionValid(action, game, state, boardState, cell, pieceData)) {
                                allValid = false;
                            }
                        }

                        if (allValid) {
                            actions.push(action);
                        }
                    }
                }
            }
        }

        return actions;
    }
}