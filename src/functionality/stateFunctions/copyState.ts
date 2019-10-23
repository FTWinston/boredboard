import { IGameState } from '../instances/IGameState';
import { IPiece } from '../instances/IPiece';
import { IBoard } from '../instances';

// The benchmark here (http://jsben.ch/kFXoo) shows that this method is the fastest in Chrome.
// Use of the spread operator to create objects that are going to be completely overwritten is somehow faster than initialising them as empty,
// presumably because the memory for them is all allocated once, rather than piecemeal.
export function copyState(source: IGameState) {
    const dest: IGameState = {
        boards: { ...source.boards }
    };

    for (const board in source.boards) {
        const oldBoard = source.boards[board]!
        const newBoard: IBoard = {
            definition: oldBoard.definition,
            cellContents: { ...oldBoard.cellContents },
        };

        for (const cell in oldBoard.cellContents) {
            const oldContents = oldBoard.cellContents[cell]!;
            const newContents: Record<number, IPiece | undefined> = { ...oldContents };

            for (const pieceID in oldContents) {
                newContents[pieceID as unknown as number] = { ...oldContents[pieceID as unknown as number]! };
            }

            newBoard.cellContents[cell] = newContents;
        }

        dest.boards[board] = newBoard;
    }

    return dest;
}