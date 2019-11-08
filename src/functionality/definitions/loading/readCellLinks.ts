import { IBoardDefinition } from '../../../data/IBoardDefinition';

export function readCellLinks(data: IBoardDefinition, allCells: Set<string>) {
    const results = new Map<string, Map<string, string[]>>(); // from cell, link type, to cells

    for (const fromCell in data.links) {
        allCells.add(fromCell);
        const cellLinks = data.links[fromCell];

        let fromCellInfo = results.get(fromCell);
        if (fromCellInfo === undefined) {
            fromCellInfo = new Map<string, string[]>();
            results.set(fromCell, fromCellInfo);
        }

        for (const linkType in cellLinks) {
            const toCells = cellLinks[linkType]!;
            fromCellInfo.set(linkType, toCells);

            for (const cell of toCells) {
                allCells.add(cell);
            }
        }
    }

    return results;
}