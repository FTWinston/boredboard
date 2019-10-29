import { IBoardDefinition } from '../../data/IBoardDefinition';
import { ILink, IRelativeLink, IPlayerLink, IGroupItem, IRegion } from './boardReducer';

export function readStateFromBoard(board: IBoardDefinition) {
    const linkTypes = new Set<string>();
    const links = readBoardLinks(board, linkTypes);

    const relativeLinkTypes = new Set<string>();
    const relativeLinks = readBoardRelativeLinks(board, relativeLinkTypes);

    const playerLinkTypes = new Set<string>();
    const playerLinks = readBoardPlayerLinks(board, playerLinkTypes);

    const linkGroupTypes = new Set<string>();
    const linkGroupItems = readBoardLinkGroups(board, linkGroupTypes);

    return {
        imageUrl: board.imageUrl,
        cells: Object.keys(board.links),
        linkTypes: [...linkTypes],
        links,
        relativeLinkTypes: [...relativeLinkTypes],
        relativeLinks: relativeLinks,
        playerLinkTypes: [...playerLinkTypes],
        playerLinks: playerLinks,
        linkGroupTypes: [...linkGroupTypes],
        linkGroupItems,
        regions: readBoardRegions(board),
    };
}

function readBoardLinks(board: IBoardDefinition, linkTypes: Set<string>) {
    const links: ILink[] = [];

    for (const fromCell in board.links) {
        const cellLinks = board.links[fromCell];

        for (const linkType in cellLinks) {
            linkTypes.add(linkType);
            const toCells = cellLinks[linkType]!;

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

function readBoardRelativeLinks(board: IBoardDefinition, relativeLinkTypes: Set<string>) {
    const relativeLinks: IRelativeLink[] = [];

    for (const relativeLinkType in board.relativeLinks) {
        relativeLinkTypes.add(relativeLinkType);

        const relativeTypeData = board.relativeLinks[relativeLinkType];

        for (const fromLinkType in relativeTypeData) {
            const toLinkTypes = relativeTypeData[fromLinkType]!;

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

function readBoardPlayerLinks(board: IBoardDefinition, playerLinkTypes: Set<string>) {
    const links: IPlayerLink[] = [];

    for (const playerLinkType in board.playerLinks) {
        const typePlayers = board.playerLinks[playerLinkType]!;

        for (const player in typePlayers) {
            playerLinkTypes.add(playerLinkType);
            const toLinkTypes = typePlayers[player]!;
            const playerID = parseInt(player);

            for (const toLinkType of toLinkTypes) {
                links.push({
                    player: playerID,
                    playerLinkType,
                    linkType: toLinkType,
                });
            }
        }
    }

    return links;
}

function readBoardLinkGroups(board: IBoardDefinition, linkGroupTypes: Set<string>) {
    const linkGroupItems: IGroupItem[] = [];

    for (const groupType in board.linkGroups) {
        linkGroupTypes.add(groupType);

        const itemNames = board.linkGroups[groupType]!;

        for (const itemName of itemNames) {
            linkGroupItems.push({
                groupType,
                itemName,
            });
        }
    }

    return linkGroupItems;
}

function readBoardRegions(board: IBoardDefinition) {
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