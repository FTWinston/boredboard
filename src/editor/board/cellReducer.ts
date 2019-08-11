export interface IEditCellInfo {
    id: string;
    bounds: ClientRect | DOMRect;
    links: Map<string, IEditCellInfo[]>;
}

interface IState {
    cells: IEditCellInfo[];
    nextId: string;
    nextIdNumber: number;
}

export type CellAction = {
    type: 'set cells',
    cells: IEditCellInfo[],
} | {
    type: 'add cell',
    id: string,
    bounds: ClientRect | DOMRect,
} | {
    type: 'remove cell',
    id: string,
}

export function getInitialCellState(): IState {
    return {
        cells: [],
        nextId: 'cell1',
        nextIdNumber: 1,
    };
}

export function cellReducer(state: IState, action: CellAction): IState {
    switch (action.type) {
        case 'set cells': {
            const idNumber = findUnusedId(0, 'cell');

            return {
                cells: action.cells.slice(),
                nextId: 'cell' + idNumber,
                nextIdNumber: idNumber,
            };
        }
        case 'add cell': {
            if (state.cells.find(c => c.id === action.id) !== undefined) {
                return state;
            }

            const idNumber = findUnusedId(state.nextIdNumber, 'cell');

            return {
                ...state,
                cells: [
                    ...state.cells,
                    {
                        id: action.id,
                        bounds: action.bounds,
                        links: new Map<string, IEditCellInfo[]>(),
                    }
                ],
                nextId: 'cell' + idNumber,
                nextIdNumber: idNumber,
            };
        }

        case 'remove cell': {
            return {
                ...state,
                cells: state.cells.filter(c => c.id !== action.id),
            };
        }
    }
}

function findUnusedId(number: number, prefix: string) {
    let id: string;

    do {
        number++;

        id = prefix + number.toString();
    } while (document.getElementById(id) !== null);

    return number;
}