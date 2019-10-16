import { IBoard } from '../data/IBoard';
import { readLinkTypes } from './readLinkTypes';
import { readCellLinks } from './readCellLinks';

export class Board {
    private readonly cellLinks: Map<string, Map<string, string[]>>; // from cell, link type, to cells
    private readonly directionCache: Map<number, Map<string | null, Map<string, string[]>>>; // player, base link type, direction name, link types

    constructor(data: IBoard) {
        this.cellLinks = readCellLinks(data);
        this.directionCache = readLinkTypes(data);
        // TODO: data.regions;
    }

    public traceLink(fromCell: string, linkType: string, minDistance: number, maxDistance?: number) {
        const resultCells = new Set<string>();

        let currentCells = new Set<string>(fromCell);

        let distance = 0;

        while (!(distance > maxDistance!)) { // if max distance is undefined, or if we haven't reached it yet
            const nextCells = new Set<string>();

            for (const currentCell of currentCells) {
                if (distance >= minDistance) {
                    resultCells.add(currentCell);
                }

                const cellLinks = this.cellLinks.get(currentCell);
                if (cellLinks !== undefined) {
                    const linkedCells = cellLinks.get(linkType);

                    if (linkedCells !== undefined) {
                        for (const nextCell of linkedCells) {
                            nextCells.add(nextCell);
                        }
                    }
                }
            }

            currentCells = nextCells;
        }

        return resultCells;
    }

    public resolveDirection(directionName: string, player: number = 0, baseLinkType: string | null = null) {
        const playerCache = this.directionCache.get(player);
        if (playerCache === undefined) {
            return [];
        }

        const baseLinkTypeCache = playerCache.get(baseLinkType);
        if (baseLinkTypeCache === undefined) {
            return [];
        }

        const linkTypes = baseLinkTypeCache.get(directionName);

        return linkTypes === undefined
            ? []
            : linkTypes;
    }
}