import { IBoard } from '../data/IBoard';

export class Board {
    private linkTypes = new Set<String>();
    private cellLinks = new Map<string, Map<string, string[]>>(); // from cell, link type, to cells
    private relativeLinkTypes = new Map<string, Map<string, string[]>>(); // relative name, from link type, to link types
    private playerLinkTypes = new Map<string, Map<number, string>>(); // player link name, player, link type
    private linkGroups = new Map<string, string[]>(); // group name, link types

    constructor(data: IBoard) {
        this.populateCellLinks(data);
        this.populateRelativeLinks(data);
        this.populatePlayerLinkTypes(data);
        this.populateLinkGroups(data);

        // TODO: data.regions;
    }

    public traceLink(fromCell: string, linkType: string) {
        const cellLinks = this.cellLinks.get(fromCell);

        if (cellLinks === undefined) {
            return [];
        }

        const connectedCells = cellLinks.get(linkType);

        return connectedCells === undefined
            ? []
            : connectedCells;
    }

    public traceLinks(fromCell: string, linkName: string, player?: number, baseDirection?: string) : Array<[string, string[]]> {
        const linkTypes = this.resolveLinkType(linkName, player, baseDirection)

        return linkTypes.map(linkType => [
            linkType,
            this.traceLink(fromCell, linkType)
        ]);
    }

    private resolveLinkType(linkName: string, player?: number, baseDirection?: string) {
        const group = this.linkGroups.get(linkName);
        if (group === undefined) {
            return this.resolveSingleLinkType(linkName, player, baseDirection);
        }

        const linkTypes = new Set<string>();
        for (const groupLinkName of group) {
            const groupLinkTypes = this.resolveSingleLinkType(groupLinkName, player, baseDirection);
            for (const linkType of groupLinkTypes) {
                linkTypes.add(linkType);
            }
        }

        return [...linkTypes];
    }

    private resolveSingleLinkType(linkName: string, player?: number, baseDirection?: string) {
        if (this.linkTypes.has(linkName)) {
            return [linkName];
        }

        if (baseDirection !== undefined) {
            const relativeLink = this.relativeLinkTypes.get(linkName);
            if (relativeLink !== undefined) {
                const linkTypes = relativeLink.get(baseDirection);
                return linkTypes === undefined
                    ? []
                    : linkTypes;
            }
        }

        if (player !== undefined) {
            const playerLinks = this.playerLinkTypes.get(linkName);
            if (playerLinks !== undefined) {
                const linkType = playerLinks.get(player);
                return linkType === undefined
                    ? []
                    : [linkType];
            }
        }

        return [];
    }

    private populateCellLinks(data: IBoard) {
        for (const fromCell in data.links) {
            const cellLinks = data.links[fromCell];

            let fromCellInfo = this.cellLinks.get(fromCell);
            if (fromCellInfo === undefined) {
                fromCellInfo = new Map<string, string[]>();
                this.cellLinks.set(fromCell, fromCellInfo);
            }

            for (const linkType in cellLinks) {
                this.linkTypes.add(linkType);

                const toCells = cellLinks[linkType];
                fromCellInfo.set(linkType, toCells);
            }
        }
    }

    private populateRelativeLinks(data: IBoard) {
        for (const relativeLinkType in data.relativeLinks) {
            const relativeTypeData = data.relativeLinks[relativeLinkType];
    
            let linkTypeInfo = this.relativeLinkTypes.get(relativeLinkType);
            if (linkTypeInfo === undefined) {
                linkTypeInfo = new Map<string, string[]>();
                this.relativeLinkTypes.set(relativeLinkType, linkTypeInfo);
            }

            for (const fromLinkType in relativeTypeData) {
                const toLinkTypes = relativeTypeData[fromLinkType];
                linkTypeInfo.set(fromLinkType, toLinkTypes);
            }
        }
    }
    
    private populatePlayerLinkTypes(data: IBoard) {
        for (const playerLinkType in data.playerLinks) {
            const typePlayers = data.playerLinks[playerLinkType];
    
            let playerTypeInfo = this.playerLinkTypes.get(playerLinkType);
            if (playerTypeInfo === undefined) {
                playerTypeInfo = new Map<number, string>();
                this.playerLinkTypes.set(playerLinkType, playerTypeInfo);
            }

            for (const player in typePlayers) {
                const linkType = typePlayers[player];
                playerTypeInfo.set(parseInt(player), linkType);
            }
        }
    }

    private populateLinkGroups(data: IBoard) {
        for (const groupName in data.linkGroups) {
            const linkTypes = data.linkGroups[groupName];
            this.linkGroups.set(groupName, linkTypes);
        }
    }
}