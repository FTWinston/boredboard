import { IBoardDefinition } from '../data/IBoardDefinition';

export function readCellLinks(data: IBoardDefinition) {
    const results = new Map<string, Map<string, string[]>>(); // from cell, link type, to cells

    for (const fromCell in data.links) {
        const cellLinks = data.links[fromCell];

        let fromCellInfo = results.get(fromCell);
        if (fromCellInfo === undefined) {
            fromCellInfo = new Map<string, string[]>();
            results.set(fromCell, fromCellInfo);
        }

        for (const linkType in cellLinks) {
            const toCells = cellLinks[linkType];
            fromCellInfo.set(linkType, toCells);
        }
    }

    return results;
}