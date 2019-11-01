import { IBoard } from '../IBoard';
import { isEmpty } from './isEmpty';

export function removePiece(board: IBoard, cell: string, piece: string, removeEmpty: boolean = true) {
    const cellContent = board.cellContents[cell];
    
    if (cellContent === undefined) {
        return undefined;
    }
    
    const pieceData = cellContent[piece];

    if (pieceData === undefined) {
        return undefined;
    }

    delete cellContent[piece];

    if (removeEmpty && isEmpty(cellContent)) {
        delete board.cellContents[cell];
    }
    
    return pieceData;
}