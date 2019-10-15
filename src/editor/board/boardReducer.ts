import { IBoard } from '../../data/IBoard';

export interface ILink {
    fromCell: string;
    toCell: string;
    type: string;
}

export interface IRelativeLink {
    relativeLinkType: string;
    fromType: string;
    toType: string;
}

export interface IPlayerLink {
    playerLinkType: string;
    player: number;
    linkType: string;
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
    relativeLinkTypes: string[];
    relativeLinks: IRelativeLink[];
    playerLinkTypes: string[];
    playerLinks: IPlayerLink[];
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
    type: 'set relative link types';
    relativeLinkTypes: string[];
} | {
    type: 'add relative link type';
    relativeLinkType: string;
} | {
    type: 'remove relative link type';
    relativeLinkType: string;
} | {
    type: 'rename relative link type';
    oldName: string;
    newName: string;
} | {
    type: 'set relative links';
    relativeLinks: IRelativeLink[];
} | {
    type: 'add relative link';
    fromType: string;
    toType: string;
    relativeLinkType: string;
} | {
    type: 'remove relative link';
    fromType: string;
    toType: string;
    relativeLinkType: string;
} | {
    type: 'set player link types';
    playerLinkTypes: string[];
} | {
    type: 'add player link type';
    playerLinkType: string;
} | {
    type: 'remove player link type';
    playerLinkType: string;
} | {
    type: 'rename player link type';
    oldName: string;
    newName: string;
} | {
    type: 'set player links';
    playerLinks: IPlayerLink[];
} | {
    type: 'remove player link';
    player: number;
    playerLinkType: string;
} | {
    type: 'set player link';
    player: number;
    playerLinkType: string;
    linkType: string;
} | {
    type: 'set regions';
    regions: IRegion[];
}

export function getInitialState(board?: IBoard): IState {
    if (board !== undefined) {
        const linkTypes = new Set<string>();
        const links = readBoardLinks(board, linkTypes);

        const relativeLinkTypes = new Set<string>();
        const relativeLinks = readBoardRelativeLinks(board, relativeLinkTypes);

        const playerLinkTypes = new Set<string>();
        const playerLinks = readBoardPlayerLinks(board, playerLinkTypes);

        return {
            imageUrl: board.imageUrl,
            cells: Object.keys(board.links),
            linkTypes: [...linkTypes],
            links,
            relativeLinkTypes: [...relativeLinkTypes],
            relativeLinks: relativeLinks,
            playerLinkTypes: [...playerLinkTypes],
            playerLinks: playerLinks,
            regions: readBoardRegions(board),
        };
    }

    return {
        imageUrl: '',
        cells: [],
        linkTypes: [],
        links: [],
        relativeLinkTypes: [],
        relativeLinks: [],
        regions: [],
        playerLinkTypes: [],
        playerLinks: [],
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

function readBoardRelativeLinks(board: IBoard, relativeLinkTypes: Set<string>) {
    const relativeLinks: IRelativeLink[] = [];

    for (const fromLinkType in board.relativeLinks) {
        const typeRelativeLinks = board.relativeLinks[fromLinkType];

        for (const relativeLinkType in typeRelativeLinks) {
            relativeLinkTypes.add(relativeLinkType);
            const toLinkTypes = typeRelativeLinks[relativeLinkType];

            for (const toLinkType of toLinkTypes) {
                relativeLinks.push({
                    fromType: fromLinkType,
                    toType: toLinkType,
                    relativeLinkType: relativeLinkType,
                });
            }
        }
    }

    return relativeLinks;
}

function readBoardPlayerLinks(board: IBoard, playerLinkTypes: Set<string>) {
    const links: IPlayerLink[] = [];

    for (const player in board.playerLinks) {
        const playerID = parseInt(player);

        const playerLinks = board.playerLinks[playerID];

        for (const playerLinkType in playerLinks) {
            playerLinkTypes.add(playerLinkType);
            const toLinkType = playerLinks[playerLinkType];

            links.push({
                player: playerID,
                playerLinkType,
                linkType: toLinkType,
            });
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

        case 'set relative link types':
            return {
                ...state,
                relativeLinkTypes: action.relativeLinkTypes,
                relativeLinks: state.relativeLinks.filter( // remove invalid relative links
                    l => action.relativeLinkTypes.indexOf(l.relativeLinkType) !== -1
                ),
            };

        case 'add relative link type':
            return {
                ...state,
                relativeLinkTypes: [
                    ...state.relativeLinkTypes,
                    action.relativeLinkType,
                ],
            };

        case 'remove relative link type':
            return {
                ...state,
                linkTypes: state.linkTypes.filter(t => t !== action.relativeLinkType),
            };

        case 'rename relative link type':
            return {
                ...state,
                relativeLinkTypes: state.relativeLinkTypes.map(t => t === action.oldName ? action.newName : t),
                relativeLinks: state.relativeLinks.map(l => ({
                    ...l,
                    relativeLinkType: l.relativeLinkType === action.oldName ? action.newName : l.relativeLinkType,
                }))
            };

        case 'set relative links':
            return {
                ...state,
                relativeLinks: action.relativeLinks.filter(r => isValidRelativeLink(r, state)),
            };

        case 'add relative link':
            const newRelativeLink = {
                fromType: action.fromType,
                toType: action.toType,
                relativeLinkType: action.relativeLinkType,
            };

            if (!isValidRelativeLink(newRelativeLink, state) || isDuplicateRelativeLink(newRelativeLink, state.relativeLinks)) {
                return state;
            }

            return {
                ...state,
                relativeLinks: [
                    ...state.relativeLinks,
                    newRelativeLink,
                ],
            };

        case 'remove relative link':
            return {
                ...state,
                relativeLinks: state.relativeLinks.filter(
                    link => link.fromType !== action.fromType
                        || link.toType !== action.toType
                        || link.relativeLinkType !== action.relativeLinkType
                ),
            };
        
        case 'set player link types':
            return {
                ...state,
                playerLinkTypes: action.playerLinkTypes,
                playerLinks: state.playerLinks.filter(link => action.playerLinkTypes.indexOf(link.playerLinkType) !== -1),
            }
        
        case 'add player link type':
            return {
                ...state,
                playerLinkTypes: [
                    ...state.playerLinkTypes,
                    action.playerLinkType,
                ],
            }

        case 'remove player link type':
            return {
                ...state,
                playerLinkTypes: state.playerLinkTypes.filter(t => t !== action.playerLinkType),
            };
            
        case 'rename player link type':
            return {
                ...state,
                playerLinkTypes: state.playerLinkTypes.map(t => t === action.oldName ? action.newName : t),
                playerLinks: state.playerLinks.map(l => ({
                    ...l,
                    playerLinkType: l.playerLinkType === action.oldName ? action.newName : l.playerLinkType,
                }))
            };
            
        case 'set player links':
            return {
                ...state,
                playerLinks: action.playerLinks.filter(l => isValidPlayerLink(l, state)),
            };

        case 'remove player link':
            return {
                ...state,
                playerLinks: state.playerLinks.filter(
                    link => link.player !== action.player
                        || link.playerLinkType !== action.playerLinkType
                ),
            };
            
        case 'set player link':
                return {
                    ...state,
                    playerLinks: state.playerLinks.map(
                        link => link.player !== action.player
                            || link.playerLinkType !== action.playerLinkType
                            ? link
                            : {
                                player: action.player,
                                playerLinkType: action.playerLinkType,
                                linkType: action.linkType,
                            }
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

function isValidRelativeLink(relativeLink: IRelativeLink, state: IState) {
    return state.linkTypes.indexOf(relativeLink.fromType) !== -1
        && state.linkTypes.indexOf(relativeLink.toType) !== -1
        && state.relativeLinkTypes.indexOf(relativeLink.relativeLinkType) !== -1;
}

export function isDuplicateRelativeLink(relativeLink: IRelativeLink, existingRelativeLinks: IRelativeLink[]) {
    return existingRelativeLinks.find(
        r => r.fromType === relativeLink.fromType
        && r.toType === relativeLink.toType
        && r.relativeLinkType === relativeLink.relativeLinkType
    ) !== undefined;
}

function isValidPlayerLink(playerLink: IPlayerLink, state: IState) {
    return state.playerLinkTypes.indexOf(playerLink.playerLinkType) !== -1
}