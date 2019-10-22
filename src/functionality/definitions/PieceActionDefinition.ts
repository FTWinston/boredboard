import { MoveType } from './MoveType';
import { IPieceActionCondition } from './IPieceActionCondition';
import { GameDefinition } from './GameDefinition';
import { IPlayerAction, IPieceMovement } from '../instances/IPlayerAction';
import { IGameState } from '../instances/IGameState';
import { BoardDefinition } from './BoardDefinition';

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

        const pieceData = fromCellContent[piece];
        if (pieceData === undefined) {
            return [];
        }

        for (const condition of this.conditions) {
            if (!condition.isStateValid(game, state, boardState, cell, pieceData)) {
                return [];
            }
        }

        const initialPreviousLinkType: string | null = null;

        const emptyMove = {
            piece: piece,
            fromBoard: board,
            toBoard: board,
            fromCell: cell,
            toCell: cell,
        }

        const movements: IPieceMovement[] = [];

        this.recursiveApplyMovement(0, emptyMove, movements, boardDef, pieceData.owner, initialPreviousLinkType);

        const actions: IPlayerAction[] = movements.map(m => ({
            pieceMovement: [m],
        }));

        // only use generated actions if they satisfy all of their conditions
        return actions.filter(action => {
            for (const condition of this.conditions) {
                if (!condition.isActionValid(action, game, state, boardState, cell, pieceData)) {
                    return false;
                }
            }
            return true;
        });
    }

    private recursiveApplyMovement(
        sequencePos: number,
        cumulativeMovement: IPieceMovement,
        movementResults: IPieceMovement[],
        board: BoardDefinition,
        player: number,
        previousLinkType: string | null
    ) {
        const moveElement = this.moveSequence[sequencePos];
        const isLastStep = sequencePos >= this.moveSequence.length - 1;

        if (moveElement.optional) {
            // Run straight onto the next 
            if (isLastStep) {
                movementResults.push(cumulativeMovement);
            }
            else {
                this.recursiveApplyMovement(sequencePos + 1 , cumulativeMovement, movementResults, board, player, previousLinkType);
            }
        }

        // get all the link types to test for this element of the sequence
        const testLinkTypes = new Set<string>();
        for (const direction of moveElement.directions) {
            const linkTypes = board.resolveDirection(direction, player, previousLinkType);
            for (const linkType of linkTypes) {
                testLinkTypes.add(linkType);
            }
        }

        // Trace for every link type, and then loop over each destination cell that is reached
        for (const linkType of testLinkTypes) {
            const destCells = board.traceLink(cumulativeMovement.toCell, linkType, moveElement.minDistance, moveElement.maxDistance);

            for (const destCell of destCells) {
                // Record movement to this destination cell. If this was the last step, output it. Otherwise, resolve the next step.
                const stepMovement = {
                    ...cumulativeMovement,
                    toCell: destCell,
                };

                if (isLastStep) {
                    movementResults.push(stepMovement);
                }
                else {
                    this.recursiveApplyMovement(sequencePos + 1 , stepMovement, movementResults, board, player, linkType);
                }
            }
        }
    }
}