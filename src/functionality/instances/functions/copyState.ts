import { IGameState } from '../IGameState';
import { IPiece } from '../IPiece';
import { IBoard } from '..';
import { Dictionary } from '../../../data/Dictionary';

// The benchmark here (http://jsben.ch/kFXoo) shows that this method is the fastest in Chrome.
// Use of the spread operator to create objects that are going to be completely overwritten is somehow faster than initialising them as empty,
// presumably because the memory for them is all allocated once, rather than piecemeal.
export function copyState(source: IGameState) {
    const dest: IGameState = {
        boards: { ...source.boards }
    };

    for (const board in source.boards) {
        const oldBoard = source.boards[board]!
        const newBoard = copyBoard(oldBoard);

        dest.boards[board] = newBoard;
    }

    return dest;
}

export function copyBoard(oldBoard: IBoard) {
    const newBoard: IBoard = {
        definition: oldBoard.definition,
        cellContents: { ...oldBoard.cellContents },
    };

    for (const cell in oldBoard.cellContents) {
        const oldContents = oldBoard.cellContents[cell]!;
        const newContents: Dictionary<string, IPiece> = { ...oldContents };

        for (const pieceID in oldContents) {
            newContents[pieceID] = { ...oldContents[pieceID]! };
        }

        newBoard.cellContents[cell] = newContents;
    }

    return newBoard;
}