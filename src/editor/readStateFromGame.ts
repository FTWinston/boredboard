import { IGameDefinition } from '../data/IGameDefinition';
import { IState } from './gameReducer';
import { Dictionary } from '../data/Dictionary';

export function readStateFromGame(game: IGameDefinition): IState {
    const result = {
        rules: game.rules,
        rulesValid: false, // TODO: validate
        boards: readDictionary(game.boards),
        pieces: readDictionary(game.pieces),
        nextUnusedPieceID: 1, // TODO: calculate this
        // TODO: read initial state
    };

    return result;
}

function readDictionary<TVal>(source: Dictionary<string, TVal>) {
    const names = Object.keys(source);

    return names.map(name => ({
        id: name,
        isValid: false, // TODO: validate?
        value: source[name]!,
    }));
}