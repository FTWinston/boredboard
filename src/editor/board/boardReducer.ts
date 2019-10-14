import { IBoard } from '../../data/IBoard';

export interface ILink {
    fromCell: string;
    toCell: string;
    type: string;
}

export interface IRelation {
    fromType: string;
    toType: string;
    relation: string;
}

export interface IRegion {
    name: string;
    player: number; // 0 for none, 1, 2 etc otherwise
    cells: string[];
}

interface IState {
    imageUrl: string;
    cells: string[];
    linkTypes: string[];
    links: ILink[];
    relationTypes: string[];
    relations: IRelation[];
    regions: IRegion[];
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
    type: 'add link type';
    linkType: string;
} | {
    type: 'remove link type';
    linkType: string;
} | {
    type: 'rename link type';
    oldName: string;
    newName: string;
} | {
    type: 'set links';
    links: ILink[];
} | {
    type: 'add links';
    links: ILink[];
} | {
    type: 'add link';
    fromCell: string;
    toCell: string;
    linkType: string;
} | {
    type: 'remove link';
    fromCell: string;
    toCell: string;
    linkType: string;
} | {
    type: 'set relation types';
    relationTypes: string[];
} | {
    type: 'add relation type';
    relationType: string;
} | {
    type: 'remove relation type';
    relationType: string;
} | {
    type: 'rename relation type';
    oldName: string;
    newName: string;
} | {
    type: 'set relations';
    relations: IRelation[];
} | {
    type: 'add relation';
    fromType: string;
    toType: string;
    relationType: string;
} | {
    type: 'remove relation';
    fromType: string;
    toType: string;
    relationType: string;
} | {
    type: 'set regions';
    regions: IRegion[];
}

export function getInitialState(board?: IBoard): IState {
    if (board !== undefined) {
        const linkTypes = new Set<string>();
        const links = readBoardLinks(board, linkTypes);

        const relationTypes = new Set<string>();
        const relations = readBoardRelations(board, relationTypes);

        return {
            imageUrl: board.imageUrl,
            cells: Object.keys(board.links),
            linkTypes: [...linkTypes],
            links,
            relationTypes: [...relationTypes],
            relations,
            regions: readBoardRegions(board),
        };
    }

    return {
        imageUrl: '',
        cells: [],
        linkTypes: [],
        links: [],
        relationTypes: [],
        relations: [],
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

function readBoardRelations(board: IBoard, relationTypes: Set<string>) {
    const relations: IRelation[] = [];

    for (const fromLinkType in board.relations) {
        const typeRelations = board.relations[fromLinkType];

        for (const relationType in typeRelations) {
            relationTypes.add(relationType);
            const toLinkTypes = typeRelations[relationType];

            for (const toLinkType of toLinkTypes) {
                relations.push({
                    fromType: fromLinkType,
                    toType: toLinkType,
                    relation: relationType,
                });
            }
        }
    }

    return relations;
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

export function saveBoardData(state: IState): IBoard {
    // TODO: saving logic
    return undefined as any as IBoard;
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

        case 'add link type':
            return {
                ...state,
                linkTypes: [
                    ...state.linkTypes,
                    action.linkType,
                ],
            };

        case 'remove link type':
            return {
                ...state,
                linkTypes: state.linkTypes.filter(t => t !== action.linkType),
            };

        case 'rename link type':
            return {
                ...state,
                linkTypes: state.linkTypes.map(t => t === action.oldName ? action.newName : t),
                links: state.links.map(l => ({
                    ...l,
                    type: l.type === action.oldName ? action.newName : l.type,
                }))
            };

        case 'set links':
            return {
                ...state,
                links: action.links.filter(l => isValidLink(l, state)),
            };

        case 'add links':
            return {
                ...state,
                links: [
                    ...state.links,
                    ...action.links.filter(l => isValidLink(l, state) && !isDuplicateLink(l, state.links)),
                ],
            };
    
        case 'add link':
            const newLink = {
                fromCell: action.fromCell,
                toCell: action.toCell,
                type: action.linkType,
            };

            if (!isValidLink(newLink, state) || isDuplicateLink(newLink, state.links)) {
                return state;
            }

            return {
                ...state,
                links: [
                    ...state.links,
                    newLink,
                ],
            };

        case 'remove link':
            return {
                ...state,
                links: state.links.filter(
                    link => link.fromCell !== action.fromCell
                        || link.toCell !== action.toCell
                        || link.type !== action.linkType
                ),
            };

        case 'set relation types':
            return {
                ...state,
                relationTypes: action.relationTypes,
                relations: state.relations.filter( // remove invalid relations
                    l => action.relationTypes.indexOf(l.relation) !== -1
                ),
            };

        case 'add relation type':
            return {
                ...state,
                relationTypes: [
                    ...state.relationTypes,
                    action.relationType,
                ],
            };

        case 'remove relation type':
            return {
                ...state,
                linkTypes: state.linkTypes.filter(t => t !== action.relationType),
            };

        case 'rename relation type':
            return {
                ...state,
                relationTypes: state.relationTypes.map(t => t === action.oldName ? action.newName : t),
                relations: state.relations.map(l => ({
                    ...l,
                    relation: l.relation === action.oldName ? action.newName : l.relation,
                }))
            };

        case 'set relations':
            return {
                ...state,
                relations: action.relations.filter(r => isValidRelation(r, state)),
            };

        case 'add relation':
            const newRelation = {
                fromType: action.fromType,
                toType: action.toType,
                relation: action.relationType,
            };

            if (!isValidRelation(newRelation, state) || isDuplicateRelation(newRelation, state.relations)) {
                return state;
            }

            return {
                ...state,
                relations: [
                    ...state.relations,
                    newRelation,
                ],
            };

        case 'remove relation':
            return {
                ...state,
                relations: state.relations.filter(
                    link => link.fromType !== action.fromType
                        || link.toType !== action.toType
                        || link.relation !== action.relationType
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

function isValidLink(link: ILink, state: IState) {
    return state.cells.indexOf(link.fromCell) !== -1
        && state.cells.indexOf(link.toCell) !== -1
        && state.linkTypes.indexOf(link.type) !== -1;
}

export function isDuplicateLink(link: ILink, existingLinks: ILink[]) {
    return existingLinks.find(
        l => l.fromCell === link.fromCell
        && l.toCell === link.toCell
        && l.type === link.type
    ) !== undefined;
}

function isValidRelation(relation: IRelation, state: IState) {
    return state.linkTypes.indexOf(relation.fromType) !== -1
        && state.linkTypes.indexOf(relation.toType) !== -1
        && state.relationTypes.indexOf(relation.relation) !== -1;
}

export function isDuplicateRelation(relation: IRelation, existingRelations: IRelation[]) {
    return existingRelations.find(
        r => r.fromType === relation.fromType
        && r.toType === relation.toType
        && r.relation === relation.relation
    ) !== undefined;
}