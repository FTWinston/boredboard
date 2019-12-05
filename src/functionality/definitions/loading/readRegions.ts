import { IBoardDefinition } from '../../../data/IBoardDefinition';

export function readRegions(data: IBoardDefinition) {
    const results = new Map<string, Map<number, Set<string>>>(); // region name, owner player, cells

    for (const regionName in data.regions) {
        const regionByPlayer = new Map<number, Set<string>>();
        results.set(regionName, regionByPlayer);

        const dataByPlayer = data.regions[regionName]!;
        
        for (const player in dataByPlayer) {
            const playerData = dataByPlayer[player as unknown as number]!;

            const regionCells = new Set<string>(playerData);

            regionByPlayer.set(parseInt(player), regionCells);
        }
    }

    return results;
}