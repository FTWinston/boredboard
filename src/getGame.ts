import chessDefinition from './examples/chess'
import chessState from './examples/chess/state.json'
import { IGameDefinition } from './data/IGameDefinition';
import { IGameState } from './functionality/instances/IGameState';

export function listGames() {
    return [
        'chess',
    ];
}

export function getGame(id: string): [IGameDefinition, IGameState] | [undefined, undefined] {
    switch(id) {
        case 'chess':
            return [chessDefinition, chessState];
        default:
            return [undefined, undefined];
    }
}