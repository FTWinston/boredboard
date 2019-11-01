import { IGameState } from '../IGameState';
import { IPlayerAction, IPieceMovement } from '../IPlayerAction';
import { placePiece } from './placePiece';
import { removePiece } from './removePiece';

export function applyAction(action: IPlayerAction, state: IGameState) {
    for (const move of action.pieceMovement) {
        if (!applyMovement(move, state)) {
            return false;
        }
    }

    return true;
}

function applyMovement(move: IPieceMovement, state: IGameState) {
    const { piece, fromBoard, fromCell, toBoard, toCell } = move;

    const fromBoardInstance = state.boards[fromBoard];
    if (fromBoardInstance === undefined) {
        return false;
    }

    const toBoardInstance = state.boards[toBoard];
    if (toBoardInstance === undefined) {
        return false;
    }
    
    const pieceData = removePiece(fromBoardInstance, fromCell, piece);

    if (pieceData === undefined) {
        return false;
    }
    
    placePiece(toBoardInstance, toCell, piece, pieceData);

    return true;
}