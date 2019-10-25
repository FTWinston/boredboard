import { IBoardDefinition } from '../../data/IBoardDefinition';
import { readLinkTypes } from './loading/readLinkTypes';
import { readCellLinks } from './loading/readCellLinks';
import { GameDefinition } from './GameDefinition';
import { CellMoveability } from './CellCheckResult';

export class BoardDefinition {
    private readonly cellLinks: ReadonlyMap<string, ReadonlyMap<string, ReadonlyArray<string>>>; // from cell, link type, to cells
    private readonly directionCache: ReadonlyMap<number, ReadonlyMap<string | null, ReadonlyMap<string, ReadonlyArray<string>>>>; // player, base link type, direction name, link types

    constructor(private readonly game: GameDefinition, data: IBoardDefinition, addDirectionsTo?: Set<string>) {
        this.cellLinks = readCellLinks(data);
        this.directionCache = readLinkTypes(data, addDirectionsTo);
        // TODO: data.regions;
    }

    private readonly linkCache = new Map<string, Map<string, string[]>>();

    public traceLink(
        fromCell: string,
        linkType: string
    ) {
        let cellCache = this.linkCache.get(fromCell);
        let resultCells: string[];

        if (cellCache === undefined) {
            cellCache = new Map<string, string[]>();
            this.linkCache.set(fromCell, cellCache);

            resultCells = [];
            cellCache.set(linkType, resultCells);
        }
        else {
            let cachedCells = cellCache.get(linkType);
            if (cachedCells === undefined) {
                resultCells = [];
                cellCache.set(linkType, resultCells);
            }
            else {
                return cachedCells;
            }
        }

        const visitedCells = new Set<string>([fromCell]);

        let currentCells = new Set<string>([fromCell]);

        while (true) {
            const nextCells = new Set<string>();

            for (const currentCell of currentCells) {
                const cellLinks = this.cellLinks.get(currentCell);

                if (cellLinks !== undefined) {
                    const linkedCells = cellLinks.get(linkType);

                    if (linkedCells !== undefined) {
                        for (const nextCell of linkedCells) {
                            if (!visitedCells.has(nextCell)) {
                                visitedCells.add(nextCell);
                                nextCells.add(nextCell);
                                resultCells.push(nextCell);
                            }
                        }
                    }
                }
            }

            if (nextCells.size === 0) {
                break;
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