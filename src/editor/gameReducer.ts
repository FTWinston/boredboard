import { Dictionary } from '../data/Dictionary';
import { IBoardDefinition } from '../data/IBoardDefinition';
import { IGameDefinition } from '../data/IGameDefinition';

export type GameAction = {
    type: 'set boards';
    boards: Dictionary<string, IBoardDefinition>;
} | {
    type: 'set board';
    id: string;
    board: IBoardDefinition;
} | {
    type: 'add board';
    board: IBoardDefinition;
} | {
    type: 'remove board';
    id: string;
}

export function getInitialState(): IGameDefinition {
    return {
        boards: {},
        pieces: {},
        rules: '',
    };
}

export function reducer(state: IGameDefinition, action: GameAction): IGameDefinition {
    switch (action.type) {
        case 'set boards':
            return {
                ...state,
                boards: action.boards,
            };
        
        case 'set board':
            return {
                ...state,
                boards: {
                    ...state.boards,
                    [action.id]: action.board,
                },
            };
        
        case 'add board':
            return {
                ...state,
                boards: {
                    ...state.boards,
                    [getNewBoardID(state.boards)]: action.board,
                },
            };

        case 'remove board':
            const boards = {
                ...state.boards,
            };
            delete boards[action.id];

            return {
                ...state,
                boards,
            };
    }
}

function getNewBoardID(boards: Dictionary<string, IBoardDefinition>) {
    const baseID = 'new board'
    let id = baseID;
    let number = 0;

    while (true) {
        if (!boards.hasOwnProperty(id)) {
            return id;
        }

        id = `${baseID} ${++number}`;
    }
}