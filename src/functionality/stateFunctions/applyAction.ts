import { IGameState } from '../instances/IGameState';
import { IPlayerAction, IPieceMovement } from '../instances/IPlayerAction';

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

    const fromCellContent = fromBoardInstance.cellContents[fromCell];
    if (fromCellContent === undefined) {
        return false;
    }

    const toBoardInstance = state.boards[toBoard];
    if (toBoardInstance === undefined) {
        return false;
    }

    const toCellContent = toBoardInstance.cellContents[toCell];
    if (toCellContent === undefined) {
        return false;
    }

    const pieceData = fromCellContent[piece]
    if (pieceData === undefined) {
        return false;
    }

    delete fromCellContent[piece];

    toCellContent[piece] = pieceData;

    return true;
}