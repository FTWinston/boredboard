import { GameDefinition } from '../../definitions';
import { removePiece } from './removePiece';
import { placePiece } from './placePiece';
import { IGameState } from '../IGameState';

export function isThreatened(
    game: GameDefinition,
    state: IGameState,
    board: string,
    piece: string,
    cell: string
) {
    const boardData = state.boards[board];
    if (boardData === undefined) {
        return false;
    }

    const pieceCellContent = boardData.cellContents[cell];
    if (pieceCellContent === undefined) {
        return false;
    }

    const pieceData = pieceCellContent[piece];
    if (pieceData === undefined) {
        return false;
    }

    return checkThreat(game, state, board, piece, pieceData.owner);
}

export function wouldBeThreatenedAt(
    game: GameDefinition,
    state: IGameState,
    board: string,
    piece: string,
    currentInCell: string,
    testInCell: string
) {
    let boardData = state.boards[board];
    if (boardData === undefined) {
        return false;
    }

    // TODO: we could copy the board here, but getPossibleMoves wouldn't use that instance.
    // We could copy the whole state, but that might be unnecessarily heavy-handed.

    // Move the piece to the cell in question, see if it's threatened, then move it back.
    const pieceData = removePiece(boardData, currentInCell, piece, false);

    if (pieceData === undefined) {
        return false;
    }

    placePiece(boardData, testInCell, piece, pieceData);

    const result = checkThreat(game, state, board, piece, pieceData.owner);

    removePiece(boardData, testInCell, piece);

    placePiece(boardData, currentInCell, piece, pieceData);

    return result;
}

function checkThreat(
    game: GameDefinition,
    state: IGameState,
    board: string,
    piece: string,
    player: number
) {
    // Threatened if any piece for any other player could capture this piece IF IT WAS THEIR TURN RIGHT NOW.
    const boardData = state.boards[board]!;
    
    for (const cell in boardData.cellContents) {
        const cellData = boardData.cellContents[cell]!;

        for (const testPiece in cellData) {
            const pieceData = cellData[testPiece]!;

            if (pieceData.owner === player) {
                continue;
            }

            const pieceDef = game.pieces.get(pieceData.definition);

            if (pieceDef === undefined) {
                continue;
            }

            // This is for the player doing the capturing, not the player being captured
            const [captureBoard, captureCell] = game.rules.getCaptureDestination(pieceData.owner);
            
            for (const action of pieceDef.actions) {
                // TODO: this needs to ignore checking for threat! Otherwise we could get in an infinite loop.
                const actions = action.getPossibleActions(state, board, cell, testPiece);
                
                const canCapture = actions.some(a => a.pieceMovement.some(m => m.piece === piece
                    && m.toBoard === captureBoard && m.toCell === captureCell));
    
                if (canCapture) {
                    return true;
                }
            }
        }
    }

    return false;
}