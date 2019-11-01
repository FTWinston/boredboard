import { IPiece } from '../IPiece';
import { IBoard } from '../IBoard';

export function placePiece(board: IBoard, cell: string, piece: string, pieceData: IPiece) {
    let cellContent = board.cellContents[cell];
    
    if (cellContent === undefined) {
        cellContent = {};
        board.cellContents[cell] = cellContent;
    }

    cellContent[piece] = pieceData;
}