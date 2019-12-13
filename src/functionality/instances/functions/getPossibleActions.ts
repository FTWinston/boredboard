import { IGameState } from '../IGameState';
import { IPlayerAction } from '../IPlayerAction';
import { GameDefinition } from '../../definitions';
import { getMatchingPieces } from './getMatchingPieces';

export function getPossibleActions(game: GameDefinition, state: IGameState, player: number) {
    let actions: IPlayerAction[] = [];

    const pieces = getMatchingPieces(state, p => p.owner === player);

    for (const { board, cell, piece, data } of pieces) {
        const pieceDefinition = game.pieces.get(data.definition);
        if (pieceDefinition === undefined) {
            continue;
        }

        for (const action of pieceDefinition.actions) {
            actions = [
                ...actions,
                ...action.getPossibleActions(state, board, cell, piece),
            ];
        }
    }

    return game.rules.filterActions(game, state, player, actions);
}