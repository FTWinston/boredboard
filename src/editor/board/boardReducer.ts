import { IBoardDefinition } from '../../data/IBoardDefinition';
import { readStateFromBoard } from './readStateFromBoard';

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

export interface IGroupItem {
    groupType: string;
    itemName: string;
}

export interface IRegionCell {
    region: string;
    player: number; // 0 for none, 1, 2 etc otherwise
    cell: string;
}

export interface IState {
    imageUrl: string;
    cells: Set<string>;
    linkTypes: string[];
    links: ILink[];
    relativeLinkTypes: string[];
    relativeLinks: IRelativeLink[];
    playerLinkTypes: string[];
    playerLinks: IPlayerLink[];
    linkGroupTypes: string[];
    linkGroupItems: IGroupItem[];
    regionCells: IRegionCell[];
}

export type BoardAction = {
    type: 'set image';
    url: string;
} | {
    type: 'set cells';
    cells: Set<string>;
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
    type: 'add player link';
    player: number;
    playerLinkType: string;
    linkType: string;
} | {
    type: 'remove player link';
    player: number;
    playerLinkType: string;
    linkType: string;
} | {
    type: 'set link groups';
    groupTypes: string[];
} | {
    type: 'add link group';
    groupType: string;
} | {
    type: 'remove link group';
    groupType: string;
} | {
    type: 'rename link group';
    oldName: string;
    newName: string;
} | {
    type: 'set link group items';
    linkGroupItems: IGroupItem[];
} | {
    type: 'add link group item';
    groupType: string;
    itemName: string;
} | {
    type: 'remove link group item';
    groupType: string;
    itemName: string;
} | {
    type: 'set region cells';
    regionCells: IRegionCell[];
} | {
    type: 'add region cell';
    region: string;
    player: number;
    cell: string;
} | {
    type: 'remove region cell';
    region: string;
    player: number;
    cell: string;
} | {
    type: 'remove region';
    region: string;
} | {
    type: 'rename region';
    oldName: string;
    newName: string;
};

export function getInitialState(board?: IBoardDefinition): IState {
    if (board !== undefined) {
        return readStateFromBoard(board);
    }

    return {
        imageUrl: '',
        cells: new Set<string>(),
        linkTypes: [],
        links: [],
        relativeLinkTypes: [],
        relativeLinks: [],
        regionCells: [],
        playerLinkTypes: [],
        playerLinks: [],
        linkGroupTypes: [],
        linkGroupItems: [],
    };
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
            return replaceCells(state, addToSetCopy(state.cells, action.cell))

        case 'remove cell':
            return replaceCells(state, removeFromSetCopy(state.cells, action.cell))
            
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
            const newGroup = {
                fromCell: action.fromCell,
                toCell: action.toCell,
                type: action.linkType,
            };

            if (!isValidLink(newGroup, state) || isDuplicateLink(newGroup, state.links)) {
                return state;
            }

            return {
                ...state,
                links: [
                    ...state.links,
                    newGroup,
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
        
        case 'add player link':
            const newPlayerLink = {
                player: action.player,
                playerLinkType: action.playerLinkType,
                linkType: action.linkType,
            };

            if (!isValidPlayerLink(newPlayerLink, state) || isDuplicatePlayerLink(newPlayerLink, state.playerLinks)) {
                return state;
            }

            return {
                ...state,
                playerLinks: [
                    ...state.playerLinks,
                    newPlayerLink
                ],
            };

        case 'remove player link':
            return {
                ...state,
                playerLinks: state.playerLinks.filter(
                    link => link.player !== action.player
                        || link.playerLinkType !== action.playerLinkType
                        || link.linkType !== action.linkType
                ),
            };

        case 'set link groups':
            return {
                ...state,
                linkGroupTypes: action.groupTypes,
            };
            
        case 'add link group':
            return {
                ...state,
                linkGroupTypes: [
                    ...state.linkGroupTypes,
                    action.groupType
                ],
            };

        case 'remove link group':
            return {
                ...state,
                linkGroupTypes: state.linkGroupTypes.filter(group => group !== action.groupType),
                linkGroupItems: state.linkGroupItems.filter(item => item.groupType !== action.groupType),
            };

        case 'rename link group':
            return {
                ...state,
                linkGroupTypes: state.linkGroupTypes.map(t => t === action.oldName ? action.newName : t),
                linkGroupItems: state.linkGroupItems.map(l => ({
                    ...l,
                    type: l.groupType === action.oldName ? action.newName : l.groupType,
                }))
            };
                
        case 'set link group items':
            return {
                ...state,
                linkGroupItems: action.linkGroupItems.filter(item => state.linkGroupTypes.indexOf(item.groupType) !== -1),
            };
        
        case 'add link group item': {
            const newGroupItem = {
                groupType: action.groupType,
                itemName: action.itemName,
            };
            
            if (!isValidGroupItem(newGroupItem, state) || isDuplicateGroupItem(newGroupItem, state.linkGroupItems)) {
                return state;
            }

            return {
                ...state,
                linkGroupItems: [
                    ...state.linkGroupItems,
                    newGroupItem,
                ],
            };
        }

        case 'remove link group item':
            return {
                ...state,
                linkGroupItems: state.linkGroupItems.filter(
                    item => item.groupType !== action.groupType
                    || item.itemName !== action.itemName
                ),
            }

        case 'set region cells':
            return {
                ...state,
                regionCells: action.regionCells.filter(rc => state.cells.has(rc.cell)), // only include valid cells
            };
    
        case 'add region cell': {
            const newRegionCell = {
                region: action.region,
                player: action.player,
                cell: action.cell,
            };

            if (!state.cells.has(action.cell) || isDuplicateRegionCell(newRegionCell, state.regionCells)) {
                return state;
            }

            return {
                ...state,
                regionCells: [
                    ...state.regionCells,
                    newRegionCell
                ],
            };
        }

        case 'remove region cell':
            return {
                ...state,
                regionCells: state.regionCells.filter(
                    rc => rc.region !== action.region
                        || rc.cell !== action.cell
                        || rc.player !== action.player
                ),
            };

        case 'remove region':
            return {
                ...state,
                regionCells: state.regionCells.filter(
                    rc => rc.region !== action.region
                ),
            };

        case 'rename region':
            return {
                ...state,
                regionCells: state.regionCells.map(
                    rc => ({
                        ...rc,
                        region: rc.region === action.oldName
                            ? action.newName
                            : rc.region,
                    })
                ),
            };
    }
}

function replaceCells(state: IState, cells: Set<string>) {
    return {
        ...state,
        cells,
        links: state.links.filter( // remove invalid links
            l => cells.has(l.fromCell)
            && cells.has(l.toCell)
        ),
        regions: state.regionCells.filter(rc => cells.has(rc.cell)), // remove invalid cells from existing regions
    };
}

function addToSetCopy<T>(existing: Set<T>, item: T) {
    if (existing.has(item)) {
        return existing;
    }

    const newSet = new Set<T>(existing);
    newSet.add(item);
    return newSet;
}

function removeFromSetCopy<T>(existing: Set<T>, item: T) {
    if (!existing.has(item)) {
        return existing;
    }

    const newSet = new Set<T>(existing);
    newSet.delete(item);
    return newSet;
}

function isValidLink(link: ILink, state: IState) {
    return state.cells.has(link.fromCell)
        && state.cells.has(link.toCell)
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

export function isDuplicatePlayerLink(playerLink: IPlayerLink, existingPlayerLinks: IPlayerLink[]) {
    return existingPlayerLinks.find(
        r => r.playerLinkType === playerLink.playerLinkType
        && r.player === playerLink.player
        && r.linkType === playerLink.linkType
    ) !== undefined;
}

function isValidGroupItem(groupItem: IGroupItem, state: IState) {
    return state.linkGroupTypes.indexOf(groupItem.groupType) !== -1
}

export function isDuplicateGroupItem(groupItem: IGroupItem, existingGroupItems: IGroupItem[]) {
    return existingGroupItems.find(
        r => r.groupType === groupItem.groupType
        && r.itemName === groupItem.itemName
    ) !== undefined;
}

function isDuplicateRegionCell(cell: IRegionCell, existingCells: IRegionCell[]) {
    return existingCells.find(
        rc => rc.region === cell.region
        && rc.cell === cell.cell
        && rc.player === cell.player
    ) !== undefined;
}