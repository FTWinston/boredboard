import { MoveType } from './MoveType';
import { IStateCondition } from './conditions/IStateCondition';
import { GameDefinition } from './GameDefinition';
import { IPlayerAction, IPieceMovement } from '../instances/IPlayerAction';
import { IGameState } from '../instances/IGameState';
import { BoardDefinition } from './BoardDefinition';
import { IMoveCondition } from './conditions/IMoveCondition';
import { IBoard } from '../instances/IBoard';

interface IPieceActionElement {
    readonly directions: ReadonlyArray<string>;
    readonly minDistance: number;
    readonly maxDistance?: number;
    readonly optional: boolean;
}

export class PieceActionDefinition {
    constructor(
        readonly moveType: MoveType,
        readonly moveSequence: ReadonlyArray<IPieceActionElement>,
        readonly stateConditions: ReadonlyArray<IStateCondition>,
        readonly moveConditions: ReadonlyArray<IMoveCondition>,
    ) {}

    public getPossibleActions(game: GameDefinition, state: IGameState, board: string, cell: string, piece: number) {
        const boardState = state.boards[board];
        if (boardState === undefined) {
            return [];
        }
        
        const boardDef = game.boards.get(boardState.definition);
        if (boardDef === undefined) {
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

        for (const condition of this.stateConditions) {
            if (!condition.isValid(game, state, boardState, boardDef, cell, pieceData)) {
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

        let movements: IPieceMovement[] = [];

        this.recursiveApplyMovement(0, emptyMove, movements, boardDef, boardState, pieceData.owner, initialPreviousLinkType);

        // only use generated movements if they satisfy all of their conditions
        movements = movements.filter(movement => {
            for (const condition of this.moveConditions) {
                if (!condition.isValid(movement, game, state, boardState, boardDef, pieceData)) {
                    return false;
                }
            }
            return true;
        });

        const actions = movements.map(m => ({
            actingPlayer: pieceData.owner,
            actingPiece: piece,
            targetBoard: m.toBoard,
            targetCell: m.toCell,
            pieceMovement: [m],
        } as IPlayerAction));

        return actions;
    }

    private recursiveApplyMovement(
        sequencePos: number,
        cumulativeMovement: IPieceMovement,
        movementResults: IPieceMovement[],
        boardDef: BoardDefinition,
        boardState: IBoard,
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
                this.recursiveApplyMovement(sequencePos + 1 , cumulativeMovement, movementResults, boardDef, boardState, player, previousLinkType);
            }
        }

        // get all the link types to test for this element of the sequence
        const testLinkTypes = new Set<string>();
        for (const direction of moveElement.directions) {
            const linkTypes = boardDef.resolveDirection(direction, player, previousLinkType);
            for (const linkType of linkTypes) {
                testLinkTypes.add(linkType);
            }
        }

        // Trace for every link type, and then loop over each destination cell that is reached
        for (const linkType of testLinkTypes) {
            const destCells = boardDef.traceLink(boardState, testCell, cumulativeMovement.toCell, linkType, moveElement.minDistance, moveElement.maxDistance);

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
                    this.recursiveApplyMovement(sequencePos + 1, stepMovement, movementResults, boardDef, boardState, player, linkType);
                }
            }
        }
    }
}