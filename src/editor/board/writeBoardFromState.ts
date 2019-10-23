import { IBoardDefinition } from '../../data/IBoardDefinition';
import { IState } from './boardReducer';
import { Dictionary } from '../../data/Dictionary';

export function writeBoardFromState(state: IState): IBoardDefinition {
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
    record: Dictionary<TKey, TVal>,
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
    const links: Dictionary<string, Dictionary<string, string[]>> = {};

    for (const link of state.links) {
        const fromCellData = ensureProperty(links, link.fromCell, {});
        const linkTypeData = ensureProperty(fromCellData!, link.type, []);
        linkTypeData!.push(link.toCell);
    }

    return links;
}

function writeRelativeLinks(state: IState) {
     // relative link type, from link type, to link types
    const relativeLinks: Dictionary<string, Dictionary<string, string[]>> = {};

    for (const link of state.relativeLinks) {
        const relativeTypeData = ensureProperty(relativeLinks, link.relativeLinkType, {});
        const fromTypeData = ensureProperty(relativeTypeData!, link.fromType, []);
        fromTypeData!.push(link.toType);
    }

    return relativeLinks;
}

function writePlayerLinks(state: IState) {
    // player link type, player, link types
    const playerLinks: Dictionary<string, Dictionary<number, string[]>> = {};

    for (const link of state.playerLinks) {
        const playerTypeData = ensureProperty(playerLinks, link.playerLinkType, {});
        const playerData = ensureProperty(playerTypeData!, link.player, []);
        playerData!.push(link.linkType);
    }

    return playerLinks;
}

function writeLinkGroups(state: IState) {
    const linkGroups: Dictionary<string, string[]> = {};

    for (const linkItem of state.linkGroupItems) {
        const groupItems = ensureProperty(linkGroups, linkItem.groupType, []);
        groupItems!.push(linkItem.itemName);
    }

    return linkGroups;
}

function writeRegions(state: IState) {
    return {}; // TODO
}