import { MoveType } from './MoveType';
import { IStateCondition } from './conditions/IStateCondition';
import { GameDefinition } from './GameDefinition';
import { IPlayerAction, IPieceMovement } from '../instances/IPlayerAction';
import { IGameState } from '../instances/IGameState';
import { BoardDefinition } from './BoardDefinition';
import { IMoveCondition } from './conditions/IMoveCondition';
import { IBoard } from '../instances/IBoard';
import { CellMoveability } from './CellMoveability';
import { Relationship } from './Relationship';

export type CellFilter = (
    game: GameDefinition,
    state: IGameState,
    boardState: IBoard,
    boardDef: BoardDefinition,
    cell: string,
    player: number
) => boolean;

export interface IPieceActionElement {
    readonly directions: ReadonlyArray<string>;
    readonly minDistance: number;
    readonly maxDistance?: number;
    readonly optional: boolean;
    readonly destinationCheck?: CellFilter;
}

interface IConditionalPieceMovement extends IPieceMovement {
    requiredChecks: Array<(state: IGameState, board: IBoard) => boolean>;
}

export class PieceActionDefinition {
    constructor(
        readonly game: GameDefinition,
        readonly moveType: MoveType,
        readonly moveSequence: ReadonlyArray<IPieceActionElement>,
        readonly stateConditions: ReadonlyArray<IStateCondition>,
        readonly moveConditions: ReadonlyArray<IMoveCondition>,
    ) {}

    public getPossibleActions(state: IGameState, board: string, cell: string, piece: string) {
        const boardState = state.boards[board];
        if (boardState === undefined) {
            return [];
        }
        
        const boardDef = this.game.boards.get(boardState.definition);
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

        const testCell = (cell: string) => {
            const contents = boardState.cellContents[cell];
            if (contents === undefined) {
                return CellMoveability.All;
            }

            let relationships = Relationship.None;

            for (const id in contents) {
                const otherPiece = contents[id]!;
                relationships |= this.game.rules.getRelationship(pieceData.owner, otherPiece.owner);
            }
            
            let moveability = CellMoveability.All;

            if (this.moveType !== MoveType.Leap && (this.game.rules.cellPassRelationRestriction & relationships) !== Relationship.None) {
                moveability &= ~CellMoveability.CanPass;    
            }

            if ((this.game.rules.cellStopRelationRestriction & relationships) !== Relationship.None) {
                moveability &= ~CellMoveability.CanStop;    
            }
            
            return moveability;
        };

        for (const condition of this.stateConditions) {
            if (!condition.isValid(this.game, state, boardState, boardDef, cell, pieceData)) {
                return [];
            }
        }

        const initialPreviousLinkType: string | null = null;

        const emptyMove: IConditionalPieceMovement = {
            piece: piece,
            fromBoard: board,
            toBoard: board,
            fromCell: cell,
            toCell: cell,
            intermediateCells: [],
            requiredChecks: [],
        }
        
        let movements: IConditionalPieceMovement[] = [];

        this.recursiveApplyMovement(0, emptyMove, movements, boardDef, testCell, pieceData.owner, initialPreviousLinkType);

        movements = movements.filter(movement => {
            // only use generated movements if they satisfy their own checks
            for (const check of movement.requiredChecks) {
                if (!check(state, boardState)) {
                    return false;
                }
            }

            // only use generated movements if they satisfy all of this move definition's conditions
            for (const condition of this.moveConditions) {
                if (!condition.isValid(movement, this.game, state, boardState, boardDef, pieceData)) {
                    return false;
                }
            }

            return true;
        });

        const actions = movements.map(m => {
            const action: IPlayerAction = {
                actingPlayer: pieceData.owner,
                fromCell: m.fromBoard === m.toBoard
                    ? m.fromCell
                    : undefined,
                actingPiece: piece,
                targetBoard: m.toBoard,
                targetCell: m.toCell,
                pieceMovement: [m],
            };

            delete m.requiredChecks;

            if (this.game.rules.captureStartRelations !== Relationship.None) {
                // TODO: add captures for all matching pieces in m.fromCell
            }

            if (this.game.rules.captureStopRelations !== Relationship.None) {
                action.pieceMovement = [
                    ...action.pieceMovement,
                    ...this.captureMatchingPieces(pieceData.owner, this.game.rules.captureStopRelations, board, boardState, m.toCell),
                ]
            }
            
            if (this.game.rules.capturePassRelations !== Relationship.None) {
                // TODO: add captures for all matching pieces in m.intermediateCells
            }

            return action;
        });

        return actions;
    }

    private recursiveApplyMovement(
        sequencePos: number,
        cumulativeMovement: IConditionalPieceMovement,
        movementResults: IConditionalPieceMovement[],
        boardDef: BoardDefinition,
        testCell: (cell: string) => CellMoveability,
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
                this.recursiveApplyMovement(sequencePos + 1 , cumulativeMovement, movementResults, boardDef, testCell, player, previousLinkType);
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
            const destPaths = boardDef.traceLink(testCell, cumulativeMovement.toCell, linkType, moveElement.minDistance, moveElement.maxDistance);

            for (const destPath of destPaths) {
                // Record movement to this destination cell. If this was the last step, output it. Otherwise, resolve the next step.
                const stepMovement = {
                    ...cumulativeMovement,
                    toCell: destPath.toCell,
                    intermediateCells: [
                        ...cumulativeMovement.intermediateCells,
                        ...destPath.intermediateCells,
                    ],
                    requiredChecks: [
                        ...cumulativeMovement.requiredChecks,
                    ],
                };

                // ensure that this cell is a valid destination for this step (e.g. it has no pieces in it, or an enemy piece in it)
                const check = moveElement.destinationCheck;
                if (check !== undefined) {
                    const cell = stepMovement.toCell;
                    stepMovement.requiredChecks.push((state, board) => check(this.game, state, board, boardDef, cell, player));
                }

                if (isLastStep) {
                    movementResults.push(stepMovement);
                }
                else {
                    this.recursiveApplyMovement(sequencePos + 1, stepMovement, movementResults, boardDef, testCell, player, linkType);
                }
            }
        }
    }

    private captureMatchingPieces(forPlayer: number, relationship: Relationship, board: string, boardState: IBoard, cell: string) {
        const pieces = boardState.cellContents[cell];

        if (pieces === undefined) {
            return [];
        }

        const results: IPieceMovement[] = [];

        for (const id in pieces) {
            const piece = pieces[id];

            if (piece === undefined) {
                continue;
            }
            
            if ((this.game.rules.getRelationship(forPlayer, piece.owner) & relationship) === Relationship.None) {
                continue;
            }

            results.push(this.createCaptureMovement(forPlayer, id, board, cell));
        }

        return results;
    }

    private createCaptureMovement(player: number, piece: string, fromBoard: string, fromCell: string): IPieceMovement {
        const [playerCaptureBoard, playerCaptureCell] = this.game.rules.getCaptureDestination(player);
        
        return {
            fromBoard,
            fromCell,
            piece,
            toBoard: playerCaptureBoard,
            toCell: playerCaptureCell,
            intermediateCells: [],
        }
    }
}