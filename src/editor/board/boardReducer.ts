import { IBoard } from '../../data/IBoard';

interface IState {
    imageUrl: string;
    linkTypes: Set<string>;
    cellsAndLinks: Map<string, Map<string, string[]>>;
}

export type BoardAction = {
    type: 'set image';
    url: string;
} | {
    type: 'set cells';
    cells: string[];
}

export function getInitialState(board?: IBoard): IState {
    // TODO: load existing data
    return {
        imageUrl: '',
        linkTypes: new Set<string>(),
        cellsAndLinks: new Map<string, Map<string, string[]>>(),
    };
}

export function reducer(state: IState, action: BoardAction): IState {
    switch (action.type) {
        case 'set image': {
            return {
                ...state,
                imageUrl: action.url,
            }
        }
        case 'set cells': {
            return {
                ...state,
                // TODO: cells
            };
        }
    }
}