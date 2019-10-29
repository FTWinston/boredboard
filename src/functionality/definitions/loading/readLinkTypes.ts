import { IBoardDefinition } from '../../../data/IBoardDefinition';

export function readLinkTypes(data: IBoardDefinition, addLinkTypesTo?: Set<string>) {
    const results = new Map<number, Map<string | null, Map<string, string[]>>>(); // player, base link type, link types

    const linkTypes = populateLinkTypes(data);
    const relativeLinkTypes = populateRelativeLinks(data);
    const playerLinkTypes = populatePlayerLinkTypes(data);
    const linkGroups = populateLinkGroups(data);

    if (addLinkTypesTo !== undefined) {
        for (const linkType of linkTypes) {
            addLinkTypesTo.add(linkType);
        }

        for (const [relative] of relativeLinkTypes) {
            addLinkTypesTo.add(relative);
        }

        for (const [relative] of relativeLinkTypes) {
            addLinkTypesTo.add(relative);
        }

        for (const [player] of playerLinkTypes) {
            addLinkTypesTo.add(player);
        }

        for (const [group] of linkGroups) {
            addLinkTypesTo.add(group);
        }
    }

    const players = new Set<number>();
    for (const [, linksByPlayer] of playerLinkTypes) {
        for (const [playerID] of linksByPlayer) {
            players.add(playerID);
        }
    }

    // Create a cache for each combination of player, no player (0), base link type and no base link type (null)

    createLinkCache(results, 0, null, linkTypes, relativeLinkTypes, playerLinkTypes, linkGroups);

    for (const baseLinkType of linkTypes) {
        createLinkCache(results, 0, baseLinkType, linkTypes, relativeLinkTypes, playerLinkTypes, linkGroups);
    }

    for (const player of players) {
        createLinkCache(results, player, null, linkTypes, relativeLinkTypes, playerLinkTypes, linkGroups);

        for (const baseLinkType of linkTypes) {
            createLinkCache(results, player, baseLinkType, linkTypes, relativeLinkTypes, playerLinkTypes, linkGroups);
        }
    }

    return results;
}


function populateLinkTypes(data: IBoardDefinition) {
    const results = new Set<string>();

    for (const fromCell in data.links) {
        const cellLinks = data.links[fromCell];

        for (const linkType in cellLinks) {
            results.add(linkType);
        }
    }

    return results;
}

function populateRelativeLinks(data: IBoardDefinition) {
    const results = new Map<string, Map<string, string[]>>(); // relative name, from link type, to link types

    for (const relativeLinkType in data.relativeLinks) {
        const relativeTypeData = data.relativeLinks[relativeLinkType];

        let linkTypeInfo = results.get(relativeLinkType);
        if (linkTypeInfo === undefined) {
            linkTypeInfo = new Map<string, string[]>();
            results.set(relativeLinkType, linkTypeInfo);
        }

        for (const fromLinkType in relativeTypeData) {
            const toLinkTypes = relativeTypeData[fromLinkType]!;
            linkTypeInfo.set(fromLinkType, toLinkTypes);
        }
    }

    return results;
}

function populatePlayerLinkTypes(data: IBoardDefinition) {
    const results = new Map<string, Map<number, string[]>>(); // player link name, player, link types

    for (const playerLinkType in data.playerLinks) {
        const typePlayers = data.playerLinks[playerLinkType];

        let playerTypeInfo = results.get(playerLinkType);
        if (playerTypeInfo === undefined) {
            playerTypeInfo = new Map<number, string[]>();
            results.set(playerLinkType, playerTypeInfo);
        }

        for (const player in typePlayers) {
            const linkTypes = typePlayers[player as unknown as number]!;
            playerTypeInfo.set(parseInt(player), linkTypes);
        }
    }

    return results;
}

function populateLinkGroups(data: IBoardDefinition) {
    const results = new Map<string, string[]>(); // group name, link types

    for (const groupName in data.linkGroups) {
        const linkTypes = data.linkGroups[groupName]!;
        results.set(groupName, linkTypes);
    }

    return results;
}

function createLinkCache(
    results: Map<number, Map<string | null, Map<string, string[]>>>, // player, base link type, link types
    player: number,
    baseLinkType: string | null,
    linkTypes: Set<string>,
    relativeLinkTypes: Map<string, Map<string, string[]>>, // relative name, from link type, to link types
    playerLinkTypes: Map<string, Map<number, string[]>>, // player link name, player, link types
    linkGroups: Map<string, string[]> // group name, link types
) {
    // Ensure the relevant by-player lookup exists
    let playerCache = results.get(player);
    if (playerCache === undefined) {
        playerCache = new Map<string | null, Map<string, string[]>>();
        results.set(player, playerCache);
    }

    // Create the link cache and add it to the results
    const linkCache = new Map<string, string[]>();
    playerCache.set(baseLinkType, linkCache);

    // First, put link types directly into the cache
    for (const linkType of linkTypes) {
        linkCache.set(linkType, [linkType]);
    }

    // Then resolve relative link types
    if (baseLinkType !== null) {
        for (const [relativeLinkType, linkTypeMapping] of relativeLinkTypes) {
            const baseDirMapping = linkTypeMapping.get(baseLinkType);
            if (baseDirMapping !== undefined) {
                linkCache.set(relativeLinkType, baseDirMapping);
            }
        }
    }

    // Next, resolve player link types
    for (const [playerLinkType, linkTypeMapping] of playerLinkTypes) {
        const linkTypesForPlayer = linkTypeMapping.get(player);
        if (linkTypesForPlayer !== undefined) {
            linkCache.set(playerLinkType, linkTypesForPlayer);
        }
    }

    // Lastly, resolve each group using the existing cache data
    for (const [group, directionNames] of linkGroups) {
        const linkTypes = new Set<string>();

        for (const directionName of directionNames) {
            const dirLinkTypes = linkCache.get(directionName);
            if (dirLinkTypes !== undefined) {
                for (const linkType of dirLinkTypes) {
                    linkTypes.add(linkType);
                }
            }
        }

        linkCache.set(group, [...linkTypes]);
    }
}