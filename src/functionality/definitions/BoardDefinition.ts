import { IBoardDefinition } from '../../data/IBoardDefinition';
import { readLinkTypes } from './loading/readLinkTypes';
import { readCellLinks } from './loading/readCellLinks';
import { GameDefinition } from './GameDefinition';
import { CellMoveability } from './CellMoveability';

export class BoardDefinition {
    private readonly cellLinks: ReadonlyMap<string, ReadonlyMap<string, ReadonlyArray<string>>>; // from cell, link type, to cells
    private readonly directionCache: ReadonlyMap<number, ReadonlyMap<string | null, ReadonlyMap<string, ReadonlyArray<string>>>>; // player, base link type, direction name, link types

    constructor(private readonly game: GameDefinition, data: IBoardDefinition, addDirectionsTo?: Set<string>) {
        this.cellLinks = readCellLinks(data);
        this.directionCache = readLinkTypes(data, addDirectionsTo);
        // TODO: data.regions;
    }

    public traceLink(
        testCheck: (cell: string) => CellMoveability,
        fromCell: string,
        linkType: string,
        minDistance: number,
        maxDistance?: number
    ) {
        const resultCells = new Set<string>();

        let currentCells = new Set<string>([fromCell]);

        let distance = 0;

        while (!(distance++ >= maxDistance!)) { // if max distance is undefined, or if we haven't reached it yet
            const nextCells = new Set<string>();

            for (const currentCell of currentCells) {
                const cellLinks = this.cellLinks.get(currentCell);

                if (cellLinks !== undefined) {
                    const linkedCells = cellLinks.get(linkType);

                    if (linkedCells !== undefined) {
                        for (const nextCell of linkedCells) {
                            const moveability = testCheck(nextCell);
                            
                            if (moveability & CellMoveability.CanPass) {
                                nextCells.add(nextCell);
                            }
                            
                            if (distance >= minDistance && (moveability & CellMoveability.CanStop)) {
                                resultCells.add(nextCell);
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