import { IBoardDefinition } from '../data/IBoardDefinition';
import { IGameDefinition } from '../data/IGameDefinition';
import { IPieceDefinition } from '../data/IPieceDefinition';
import { readStateFromGame, getNextPieceID } from './readStateFromGame';
import { IBoard } from '../functionality/instances/IBoard';

export interface IValidationItem<T> {
    id: string;
    isValid: boolean;
    value: T;
}

export interface IState {
    boards: IValidationItem<IBoardDefinition>[];
    pieces: IValidationItem<IPieceDefinition>[];
    initialState: IValidationItem<IBoard>[];
    rules: string;
    rulesValid: boolean;
    nextUnusedPieceID: number;
}

export type GameAction = {
    type: 'set board';
    id: string;
    isValid: boolean;
    board: IBoardDefinition;
} | {
    type: 'add board';
    isValid: boolean;
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
    id: string;
    isValid: boolean;
    piece: IPieceDefinition;
} | {
    type: 'add piece';
    isValid: boolean;
    piece: IPieceDefinition;
} | {
    type: 'remove piece';
    id: string;
} | {
    type: 'rename piece';
    oldID: string;
    newID: string;
} | {
    type: 'set rules';
    rules: string;
    isValid: boolean;
} | {
    type: 'set initial state';
    board: string;
    state: IBoard;
}

export function getInitialState(game?: IGameDefinition): IState {
    if (game !== undefined) {
        return readStateFromGame(game);
    }

    return {
        boards: [],
        pieces: [],
        initialState: [],
        rules: '',
        rulesValid: false,
        nextUnusedPieceID: 1,
    };
}

export function reducer(state: IState, action: GameAction): IState {
    switch (action.type) {
        case 'set board':
            return {
                ...state,
                boards: [
                    ...state.boards.filter(b => b.id !== action.id),
                    {
                        id: action.id,
                        isValid: action.isValid,
                        value: action.board
                    },
                ],
            };
        
        case 'add board':
            return {
                ...state,
                boards: [
                    ...state.boards,
                    {
                        id: getNewID(state.boards, 'new board'),
                        isValid: action.isValid,
                        value: action.board,
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
                        id: action.newID,
                    }
                ),
            };
        }

        case 'set piece':
            return {
                ...state,
                pieces: [
                    ...state.pieces.filter(b => b.id !== action.id),
                    {
                        id: action.id,
                        isValid: action.isValid,
                        value: action.piece
                    },
                ],
            };
        
        case 'add piece':
            return {
                ...state,
                pieces: [
                    ...state.pieces,
                    {
                        id: getNewID(state.pieces, 'new piece'),
                        isValid: action.isValid,
                        value: action.piece,
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
                        id: action.newID,
                    }
                ),
            };
        }

        case 'set rules':
            return {
                ...state,
                rules: action.rules,
                rulesValid: action.isValid,
            };

        case 'set initial state':
            const existingItem = state.initialState.find(b => b.id === action.board);
            const newItem = {
                id: action.board,
                isValid: true,
                value: action.state
            };

            // TODO: adding/removing boards and pieces should either update initial state
            // ... or mark it as invalid
            
            const initialState = existingItem === undefined
                ? [
                    ...state.initialState,
                    newItem
                ]
                : state.initialState.map(b => b.id === action.board
                    ? {
                        id: action.board,
                        isValid: true,
                        value: action.state
                    }
                    : b
                );

            return {
                ...state,
                initialState,
                nextUnusedPieceID: getNextPieceID(initialState),
            };
    }
}

function getNewID<T>(items: IValidationItem<T>[], baseID: string) {
    let id = baseID;
    let number = 0;

    while (true) {
        if (items.find(i => i.id === id) === undefined) { // eslint-disable-line
            return id;
        }

        id = `${baseID} ${++number}`;
    }
}