import { IPiece } from '../IPiece';
import { IGameState } from '../IGameState';

export type PieceFilter = (
    test: IPiece,
) => boolean;

export interface IPieceMatch {
    board: string;
    cell: string;
    piece: string;
    data: IPiece;
}

export function getMatchingPieces(state: IGameState, filter: PieceFilter) {
    const results: IPieceMatch[] = [];

    for (const board in state.boards) {
        const boardData = state.boards[board]!;

        for (const cell in boardData.cellContents) {
            const cellContent = boardData.cellContents[cell]!;

            for (const piece in cellContent) {
                const pieceData = cellContent[piece]!;

                if (filter(pieceData)) {
                    results.push({
                        board,
                        cell,
                        piece,
                        data: pieceData,
                    });
                }
            }
        }
    }

    return results;
}