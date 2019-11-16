import { IBoardDefinition } from '../data/IBoardDefinition';
import { IGameDefinition } from '../data/IGameDefinition';
import { IPieceDefinition } from '../data/IPieceDefinition';
import { readStateFromGame } from './readStateFromGame';

export interface INamed {
    id: string;
}

interface IBoard extends IBoardDefinition, INamed {}

interface IPiece extends IPieceDefinition, INamed {}

export interface IState {
    boards: IBoard[];
    pieces: IPiece[];
    rules: string;
}

export type GameAction = {
    type: 'set board';
    board: IBoard;
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
    type: 'set piece';
    piece: IPiece;
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

export function getInitialState(game?: IGameDefinition): IState {
    if (game !== undefined) {
        // IT IS FINE HERE ... something mutates it later ... and its not the reducer. Grief, is "name" the problem?
        return readStateFromGame(game);
    }

    return {
        boards: [],
        pieces: [],
        rules: '',
    };
}

export function reducer(state: IState, action: GameAction): IState {
    switch (action.type) {
        case 'set board':
            return {
                ...state,
                boards: [
                    ...state.boards.filter(b => b.id !== action.board.id),
                    action.board,
                ],
            };
        
        case 'add board':
            return {
                ...state,
                boards: [
                    ...state.boards,
                    {
                        ...action.board,
                        id: getNewID(state.boards, 'new board'),
                    },
                ],
            };

        case 'remove board': {
            return {
                ...state,
                boards: state.boards.filter(b => b.id !== action.id),
            };
        }

        case 'rename board': {
            const board = state.boards.find(b => b.id === action.oldID);
            if (board === undefined) {
                return state;
            }

            return {
                ...state,
                boards: state.boards.map(b => b !== board
                    ? b
                    : {
                        ...board,
                        id: action.newID
                    }
                ),
            };
        }

        case 'set piece':
            return {
                ...state,
                pieces: [
                    ...state.pieces.filter(b => b.id !== action.piece.id),
                    action.piece,
                ],
            };
        
        case 'add piece':
            return {
                ...state,
                pieces: [
                    ...state.pieces,
                    {
                        ...action.piece,
                        id: getNewID(state.pieces, 'new piece'),
                    },
                ],
            };

        case 'remove piece': {
            return {
                ...state,
                pieces: state.pieces.filter(p => p.id !== action.id),
            };
        }

        case 'rename piece': {
            const piece = state.pieces.find(p => p.id === action.oldID);
            if (piece === undefined) {
                return state;
            }

            return {
                ...state,
                pieces: state.pieces.map(p => p !== piece
                    ? p
                    : {
                        ...piece,
                        id: action.newID
                    }
                ),
            };
        }
    }
}

function getNewID<T>(items: INamed[], baseID: string) {
    let id = baseID;
    let number = 0;

    while (true) {
        if (items.find(i => i.id === id) === undefined) { // eslint-disable-line
            return id;
        }

        id = `${baseID} ${++number}`;
    }
}