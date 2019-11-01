import { PieceActionDefinition } from './PieceActionDefinition';
import { GameDefinition } from './GameDefinition';
import { IGameState, IBoard } from '../instances';
import { IPlayerAction } from '../instances/IPlayerAction';
import { removePiece } from '../instances/functions/removePiece';
import { placePiece } from '../instances/functions/placePiece';
import { string } from 'prop-types';

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

    public isThreatened(board: IBoard, piece: string, cell: string) {
        const pieceCellContent = board.cellContents[cell];
        if (pieceCellContent === undefined) {
            return false;
        }

        const pieceData = pieceCellContent[piece];
        if (pieceData === undefined) {
            return false;
        }

        return this.checkThreat(board, piece, pieceData.owner);
    }

    public wouldBeThreatenedAt(
        board: IBoard,
        piece: string,
        currentInCell: string,
        testInCell: string
    ) {
        // Move the piece to the cell in question, see if it's threatened, then move it back.
        const pieceData = removePiece(board, currentInCell, piece, false);

        if (pieceData === undefined) {
            return false;
        }

        placePiece(board, testInCell, piece, pieceData);

        const result = this.checkThreat(board, piece, pieceData.owner);

        removePiece(board, testInCell, piece);

        placePiece(board, currentInCell, piece, pieceData);

        return result;
    }

    private checkThreat(board: IBoard, piece: string, player: number) {
        // Threatened if any piece for any other player could capture this piece IF IT WAS THEIR TURN RIGHT NOW.
        for (const cell in board.cellContents) {
            const cellData = board.cellContents[cell]!;

            for (const testPiece in cellData) {
                const pieceData = cellData[testPiece]!;

                if (pieceData.owner === player) {
                    continue;
                }

                const pieceDef = this.game.pieces.get(pieceData.definition);

                if (pieceDef === undefined) {
                    continue;
                }

                const actions = pieceDef.getPossibleActions(state, board, cell, testPiece);

                const [captureBoard, captureCell] = this.game.rules.getCaptureDestination(player);

                const canCapture = actions.some(a => a.pieceMovement.some(m => m.piece === piece
                    && m.toBoard === captureBoard && m.toCell === captureCell));

                if (canCapture) {
                    return true;
                }
            }
        }

        return false;
    }
}