import { Dictionary } from '../data/Dictionary';
import { IBoardDefinition } from '../data/IBoardDefinition';
import { IGameDefinition } from '../data/IGameDefinition';
import { IPieceDefinition } from '../data/IPieceDefinition';

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
} | {
    type: 'rename board';
    oldID: string;
    newID: string;
} | {
    type: 'set pieces';
    pieces: Dictionary<string, IPieceDefinition>;
} | {
    type: 'set piece';
    id: string;
    piece: IPieceDefinition;
} | {
    type: 'add piece';
    piece: IPieceDefinition;
} | {
    type: 'remove piece';
    id: string;
} | {
    type: 'rename piece';
    oldID: string;
    newID: string;
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
                    [getNewID(state.boards, 'new board')]: action.board,
                },
            };

        case 'remove board': {
            const boards = {
                ...state.boards,
            };
            delete boards[action.id];

            return {
                ...state,
                boards,
            };
        }

        case 'rename board': {
            const boards = {
                ...state.boards,
            };
            const board = boards[action.oldID];
            delete boards[action.oldID];
            boards[action.newID] = board;

            return {
                ...state,
                boards,
            };
        }

        case 'set pieces':
            return {
                ...state,
                pieces: action.pieces,
            };
        
        case 'set piece':
            return {
                ...state,
                pieces: {
                    ...state.pieces,
                    [action.id]: action.piece,
                },
            };
        
        case 'add piece':
            return {
                ...state,
                pieces: {
                    ...state.pieces,
                    [getNewID(state.pieces, 'new piece')]: action.piece,
                },
            };

        case 'remove piece': {
            const pieces = {
                ...state.pieces,
            };
            delete pieces[action.id];

            return {
                ...state,
                pieces,
            };
        }

        case 'rename piece': {
            const pieces = {
                ...state.pieces,
            };
            const piece = pieces[action.oldID];
            delete pieces[action.oldID];
            pieces[action.newID] = piece;

            return {
                ...state,
                pieces,
            };
        }
    }
}

function getNewID<T>(items: Dictionary<string, T>, baseID: string) {
    let id = baseID;
    let number = 0;

    while (true) {
        if (!items.hasOwnProperty(id)) {
            return id;
        }

        id = `${baseID} ${++number}`;
    }
}