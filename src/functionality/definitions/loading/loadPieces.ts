import { PieceDefinition } from '../PieceDefinition';
import { IGameDefinition } from '../../../data/IGameDefinition';
import { parsePieceActions } from './parsePieceActions';
import { GameDefinition } from '../GameDefinition';

export function loadPieces(game: GameDefinition, data: IGameDefinition, allAllowedDirections: ReadonlySet<string>) {
    const pieces = new Map<string, PieceDefinition>();

    for (const pieceName in data.pieces) {
        const piece = data.pieces[pieceName]!;

        const actionParseResult = parsePieceActions(game, piece.behaviour, allAllowedDirections);
        if (!actionParseResult.success) {
            console.log(`failed to parse ${pieceName} behaviour`, actionParseResult.errors);
            continue; // TODO: need a better approach than just logging to console
        }

        const imageUrls = new Map<number, string>();
        console.log('loading, image urls are', piece.imageUrls);

        for (const player in piece.imageUrls) {
            const iPlayer = parseInt(player);
            imageUrls.set(iPlayer, piece.imageUrls[iPlayer]!); 
        }

        pieces.set(pieceName, new PieceDefinition(game, piece.value, actionParseResult.definition, imageUrls));
    }

    return pieces;
}