import { IState, IValidationItem } from './gameReducer';
import { IGameDefinition } from '../data/IGameDefinition';
import { Dictionary } from '../data/Dictionary';

export function writeGameFromState(state: IState): IGameDefinition {
    return {
        boards: createDictionary(state.boards),
        pieces: createDictionary(state.pieces),
        rules: state.rules,
        initialState: {
            boards: {},
            currentTurn: 1,
        },
    };
}

function createDictionary<TVal>(source: Array<IValidationItem<TVal>>) {
    const dest: Dictionary<string, TVal> = {};

    for (const item of source) {
        dest[item.id] = item.value;
    }

    return dest;
}
