import { IBoard } from '../../data/IBoard';
import { IState } from './boardReducer';

export function writeBoardFromState(state: IState): IBoard {
    // TODO: saving logic
    
    return {
        imageUrl: state.imageUrl,
        links: writeLinks(state),
        relativeLinks: writeRelativeLinks(state),
        playerLinks: writePlayerLinks(state),
        linkGroups: writeLinkGroups(state),
        regions: writeRegions(state),
    };
}

function ensureProperty<TKey extends keyof any, TVal>(
    record: Record<TKey, TVal>,
    key: TKey,
    defaultVal: TVal
) {
    let val = record[key];

    if (val !== undefined) {
        return val;
    }

    record[key] = defaultVal;
    return defaultVal;
}

function writeLinks(state: IState) {
    // from cell, link type, to cells
    const links: Record<string, Record<string, string[]>> = {};

    for (const link of state.links) {
        const fromCellData = ensureProperty(links, link.fromCell, {});
        const linkTypeData = ensureProperty(fromCellData, link.type, []);
        linkTypeData.push(link.toCell);
    }

    return links;
}

function writeRelativeLinks(state: IState) {
     // relative link type, from link type, to link types
    const relativeLinks: Record<string, Record<string, string[]>> = {};

    for (const link of state.relativeLinks) {
        const relativeTypeData = ensureProperty(relativeLinks, link.relativeLinkType, {});
        const fromTypeData = ensureProperty(relativeTypeData, link.fromType, []);
        fromTypeData.push(link.toType);
    }

    return relativeLinks;
}

function writePlayerLinks(state: IState) {
    // player link type, player, link types
    const playerLinks: Record<string, Record<number, string[]>> = {};

    for (const link of state.playerLinks) {
        const playerTypeData = ensureProperty(playerLinks, link.playerLinkType, {});
        const playerData = ensureProperty(playerTypeData, link.player, []);
        playerData.push(link.linkType);
    }

    return playerLinks;
}

function writeLinkGroups(state: IState) {
    const linkGroups: Record<string, string[]> = {};

    for (const linkItem of state.linkGroupItems) {
        const groupItems = ensureProperty(linkGroups, linkItem.groupType, []);
        groupItems.push(linkItem.itemName);
    }

    return linkGroups;
}

function writeRegions(state: IState) {
    return {}; // TODO
}