import { IBoardDefinition } from '../../data/IBoardDefinition';
import { readLinkTypes } from './loading/readLinkTypes';
import { readCellLinks } from './loading/readCellLinks';
import { readRegions } from './loading/readRegions';
import { GameDefinition } from './GameDefinition';
import { CellMoveability } from './CellMoveability';
import { ITracePath } from '../instances/IPlayerAction';

export class BoardDefinition {
    public readonly imageUrl: string;
    public readonly cells: ReadonlySet<string>;
    private readonly cellLinks: ReadonlyMap<string, ReadonlyMap<string, ReadonlyArray<string>>>; // from cell, link type, to cells
    private readonly directionCache: ReadonlyMap<number, ReadonlyMap<string | null, ReadonlyMap<string, ReadonlyArray<string>>>>; // player, base link type, direction name, link types
    private readonly regionCache: ReadonlyMap<string, ReadonlyMap<number, ReadonlySet<string>>>;

    constructor(private readonly game: GameDefinition, data: IBoardDefinition, addDirectionsTo?: Set<string>) {
        this.imageUrl = data.imageUrl;

        const cells = new Set<string>();
        this.cellLinks = readCellLinks(data, cells);
        this.cells = cells;

        this.directionCache = readLinkTypes(data, addDirectionsTo);
        
        this.regionCache = readRegions(data);
    }

    public traceLink(
        testCheck: (cell: string) => CellMoveability,
        fromCell: string,
        linkType: string,
        minDistance: number,
        maxDistance?: number
    ) {
        const resultPaths: Array<ITracePath> = [];

        let currentPaths: Array<ITracePath> = [{
            toCell: fromCell,
            intermediateCells: [],
        }];

        let distance = 0;

        while (!(distance++ >= maxDistance!)) { // if max distance is undefined, or if we haven't reached it yet
            const nextPaths: Array<ITracePath> = [];

            for (const currentPath of currentPaths) {
                const cellLinks = this.cellLinks.get(currentPath.toCell);

                if (cellLinks !== undefined) {
                    const linkedCells = cellLinks.get(linkType);

                    if (linkedCells !== undefined) {
                        for (const nextCell of linkedCells) {
                            const moveability = testCheck(nextCell);
                            
                            const nextPath = {
                                toCell: nextCell,
                                intermediateCells: [
                                    ...currentPath.intermediateCells,
                                    currentPath.toCell,
                                ],
                            };

                            if (moveability & CellMoveability.CanPass) {
                                nextPaths.push(nextPath);
                            }
                            
                            if (distance >= minDistance && (moveability & CellMoveability.CanStop)) {
                                resultPaths.push(nextPath);
                            }
                        }
                    }
                }
            }

            if (nextPaths.length === 0) {
                break;
            }

            currentPaths = nextPaths;
        }

        return resultPaths;
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

    public appendDirections(output: Set<string>) {
        for (const [, byPlayer] of this.directionCache) {
            for (const [, byBaseType] of byPlayer) {
                for (const [direction] of byBaseType) {
                    output.add(direction);
                }
            }
        }
    }

    public isCellInRegion(cell: string, name: string, players: number[] = []) {
        const regionByPlayer = this.regionCache.get(name);
        if (regionByPlayer === undefined) {
            return false;
        }

        const forAllPlayers = regionByPlayer.get(0);
        if (forAllPlayers !== undefined && forAllPlayers.has(cell)) {
            return true;
        }

        for (const player of players) {
            const forSpecificPlayer = regionByPlayer.get(player);
            if (forSpecificPlayer !== undefined && forSpecificPlayer.has(cell)) {
                return true;
            }
        }

        return false;
    }
}