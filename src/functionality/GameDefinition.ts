import { BoardDefinition } from './BoardDefinition';
import { PieceDefinition } from './PieceDefinition';
import { IGameDefinition } from '../data/IGameDefinition';
import { parsePieceActions } from './parsePieceActions';

export class GameDefinition {
    public readonly boards: ReadonlyMap<string, BoardDefinition>;
    public readonly pieces: ReadonlyMap<string, PieceDefinition>;

    constructor(data: IGameDefinition) {
        this.boards = GameDefinition.loadBoards(data);
        this.pieces = GameDefinition.loadPieces(data);
    }

    private static loadBoards(data: IGameDefinition) {
        const boards = new Map<string, BoardDefinition>();

        for (const boardName in data.boards) {
            const board = data.boards[boardName];
            boards.set(boardName, new BoardDefinition(board));
        }

        return boards;
    }

    private static loadPieces(data: IGameDefinition) {
        const pieces = new Map<string, PieceDefinition>();

        for (const pieceName in data.pieces) {
            const piece = data.pieces[pieceName];

            const actionParseResult = parsePieceActions(piece.behaviour);
            if (!actionParseResult.success) {
                console.log(`failed to parse ${pieceName} behaviour`, actionParseResult.errors);
                continue; // TODO: need a better approach than just logging to console
            }

            pieces.set(pieceName, new PieceDefinition(piece.value, actionParseResult.definition));
        }

        return pieces;
    }
}