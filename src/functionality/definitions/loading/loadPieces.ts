import { PieceDefinition } from '../PieceDefinition';
import { IGameDefinition } from '../../../data/IGameDefinition';
import { parsePieceActions } from './parsePieceActions';
import { GameDefinition } from '../GameDefinition';

export function loadPieces(game: GameDefinition, data: IGameDefinition, allAllowedDirections: ReadonlySet<string>) {
    const pieces = new Map<string, PieceDefinition>();

    for (const pieceName in data.pieces) {
        const piece = data.pieces[pieceName]!;

        const actionParseResult = parsePieceActions(piece.behaviour, allAllowedDirections);
        if (!actionParseResult.success) {
            console.log(`failed to parse ${pieceName} behaviour`, actionParseResult.errors);
            continue; // TODO: need a better approach than just logging to console
        }

        pieces.set(pieceName, new PieceDefinition(game, piece.value, actionParseResult.definition));
    }

    return pieces;
}