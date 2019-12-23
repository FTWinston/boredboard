import { IGameDefinition } from '../data/IGameDefinition';
import { IState, IValidationItem } from './gameReducer';
import { Dictionary } from '../data/Dictionary';
import { IBoard } from '../functionality/instances/IBoard';

export function readStateFromGame(game: IGameDefinition) {
    const initialState = readDictionary(game.initialState.boards); // Note: this ignores game.initialState.currentTurn

    const result: IState = {
        rules: game.rules,
        rulesValid: false, // TODO: validate
        boards: readDictionary(game.boards),
        pieces: readDictionary(game.pieces),
        initialState,
        nextUnusedPieceID: getNextPieceID(initialState),
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

export function getNextPieceID(state: IValidationItem<IBoard>[]) {
    let maxID = 0;

    for (const board of state) {
        for (const cell in board.value.cellContents) {
            const cellContent = board.value.cellContents[cell]!;

            for (const piece in cellContent) {
                // TODO: this assumes without question that IDs are numbers.
                // We really ought to enforce (elsewhere) that they really are numbers.
                maxID = Math.max(maxID, parseInt(piece));
            }
        }
    }
    
    return maxID + 1;
}