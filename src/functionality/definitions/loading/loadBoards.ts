import { BoardDefinition } from '../BoardDefinition';
import { IGameDefinition } from '../../../data/IGameDefinition';
import { GameDefinition } from '../GameDefinition';

export function loadBoards(game: GameDefinition, data: IGameDefinition): [Map<string, BoardDefinition>, ReadonlySet<string>] {
    const boards = new Map<string, BoardDefinition>();
    const allAllowedDirections = new Set<string>();

    for (const boardName in data.boards) {
        const board = data.boards[boardName]!;
        const boardDef = new BoardDefinition(game, board, allAllowedDirections);
        boards.set(boardName, boardDef);
    }

    return [boards, allAllowedDirections];
}