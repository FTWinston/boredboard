import { BoardDefinition } from './BoardDefinition';
import { PieceDefinition } from './PieceDefinition';
import { IGameDefinition } from '../../data/IGameDefinition';
import { parsePieceActions } from './parsePieceActions';

export class GameDefinition {
    public readonly boards: ReadonlyMap<string, BoardDefinition>;
    public readonly pieces: ReadonlyMap<string, PieceDefinition>;

    constructor(data: IGameDefinition) {
        let allAllowedDirections: ReadonlySet<string>;
        [this.boards, allAllowedDirections] = GameDefinition.loadBoards(data);
        this.pieces = GameDefinition.loadPieces(data, allAllowedDirections);
    }

    private static loadBoards(data: IGameDefinition): [Map<string, BoardDefinition>, ReadonlySet<string>] {
        const boards = new Map<string, BoardDefinition>();
        const allAllowedDirections = new Set<string>();

        for (const boardName in data.boards) {
            const board = data.boards[boardName];
            const boardDef = new BoardDefinition(board, allAllowedDirections);
            boards.set(boardName, boardDef);
        }

        return [boards, allAllowedDirections];
    }

    private static loadPieces(data: IGameDefinition, allAllowedDirections: ReadonlySet<string>) {
        const pieces = new Map<string, PieceDefinition>();

        for (const pieceName in data.pieces) {
            const piece = data.pieces[pieceName];

            const actionParseResult = parsePieceActions(piece.behaviour, allAllowedDirections);
            if (!actionParseResult.success) {
                console.log(`failed to parse ${pieceName} behaviour`, actionParseResult.errors);
                continue; // TODO: need a better approach than just logging to console
            }

            pieces.set(pieceName, new PieceDefinition(piece.value, actionParseResult.definition));
        }

        return pieces;
    }
}