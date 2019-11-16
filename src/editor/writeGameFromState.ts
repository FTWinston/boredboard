import { IState, INamed } from './gameReducer';
import { IGameDefinition } from '../data/IGameDefinition';
import { Dictionary } from '../data/Dictionary';

export function writeGameFromState(state: IState): IGameDefinition {
    return {
        boards: createDictionary(state.boards),
        pieces: createDictionary(state.pieces),
        rules: state.rules,
    };
}

function createDictionary<TVal>(
    source: Array<INamed & TVal>
) {
    const dest: Dictionary<string, TVal> = {};

    for (const item of source) {
        const copy = { ...item };
        delete copy['id'];
        dest[item.id] = copy;
    }

    return dest;
}
