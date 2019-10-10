import { IBoard } from '../../data/IBoard';

interface ILink {
    fromCell: string;
    toCell: string;
    type: string;
}

interface IState {
    imageUrl: string;
    cells: string[];
    linkTypes: string[];
    links: ILink[];
    regions: IRegion[];
}

interface IRegion {
    name: string;
    player: number; // 0 for none, 1, 2 etc otherwise
    cells: string[];
}

export type BoardAction = {
    type: 'set image';
    url: string;
} | {
    type: 'set cells';
    cells: string[];
} | {
    type: 'add cell';
    cell: string;
} | {
    type: 'remove cell';
    cell: string;
} | {
    type: 'set link types';
    linkTypes: string[];
} | {
    type: 'set links';
    links: ILink[];
} | {
    type: 'set regions';
    regions: IRegion[];
}

export function getInitialState(board?: IBoard): IState {
    if (board !== undefined) {
        const linkTypes = new Set<string>();
        const links = readBoardLinks(board, linkTypes);

        return {
            imageUrl: board.imageUrl,
            cells: Object.keys(board.links),
            linkTypes: [...linkTypes],
            links,
            regions: readBoardRegions(board),
        };
    }

    return {
        imageUrl: '',
        cells: [],
        linkTypes: [],
        links: [],
        regions: [],
    };
}

function readBoardLinks(board: IBoard, linkTypes: Set<string>) {
    const links: ILink[] = [];

    for (const fromCell in board.links) {
        const cellLinks = board.links[fromCell];

        for (const linkType in cellLinks) {
            linkTypes.add(linkType);
            const toCells = cellLinks[linkType];

            for (const toCell of toCells) {
                links.push({
                    fromCell,
                    toCell,
                    type: linkType,
                });
            }
        }
    }

    return links;
}

function readBoardRegions(board: IBoard) {
    const regions: IRegion[] = [];

    for (const name in board.regions) {
        const playerRegions = board.regions[name];
        
        for (const player in playerRegions) {
            const cells = playerRegions[player];

            regions.push({
                name,
                player: parseInt(player),
                cells,
            });
        }
    }
    return regions;
}

export function reducer(state: IState, action: BoardAction): IState {
    switch (action.type) {
        case 'set image':
            return {
                ...state,
                imageUrl: action.url,
            }

        case 'set cells':
            return replaceCells(state, action.cells);

        case 'add cell':
            return replaceCells(state, addToListCopy(state.cells, action.cell))

        case 'remove cell':
            return replaceCells(state, removeFromListCopy(state.cells, action.cell))
            
        case 'set link types':
            return {
                ...state,
                linkTypes: action.linkTypes,
                links: state.links.filter( // remove invalid links
                    l => action.linkTypes.indexOf(l.type) !== -1
                ),
            };

        case 'set links':
            return {
                ...state,
                links: action.links.filter( // only take valid links
                    l => state.cells.indexOf(l.fromCell) !== -1
                    && state.cells.indexOf(l.toCell) !== -1
                    && state.linkTypes.indexOf(l.type) !== -1
                ),
            };

        case 'set regions':
            return {
                ...state,
                regions: action.regions.map(r => ({ // only include valid cells
                    ...r,
                    cells: r.cells.filter(c => state.cells.indexOf(c) !== -1),
                })),
            };
    }
}

function replaceCells(state: IState, cells: string[]) {
    return {
        ...state,
        cells,
        links: state.links.filter( // remove invalid links
            l => cells.indexOf(l.fromCell) !== -1
            && cells.indexOf(l.toCell) !== -1
        ),
        regions: state.regions.map(r => ({ // remove invalid cells from existing regions
            ...r,
            cells: r.cells.filter(c => cells.indexOf(c) !== -1),
        })),
    };
}

function addToListCopy<T>(list: T[], item: T): T[] {
    const pos = list.indexOf(item);
    if (pos !== -1) {
        return list;
    }

    return [
        ...list,
        item,
    ];
}

function removeFromListCopy<T>(list: T[], item: T): T[] {
    const pos = list.indexOf(item);
    if (pos === -1) {
        return list;
    }

    list = list.slice();
    list.splice(pos, 1);

    return list;
}