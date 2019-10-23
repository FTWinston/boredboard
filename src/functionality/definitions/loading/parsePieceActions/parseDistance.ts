import { IParserError } from 'natural-configuration';

const distanceExpression = new RegExp("^(at least |at most |up to |(\\d+)(?: to |-| - |))?(\\d+)$");

export function parseDistance(
    distance: string,
    startIndex: number,
    error: (error: IParserError) => void
): [number | undefined, number | undefined] {
    const match = distance.match(distanceExpression);

    if (match === null) {
        error({
            startIndex,
            length: distance.length,
            message: `Unrecognised distance: ${distance}. Valid distances include: "any distance", "1 cell", "up to 3 cells", "2 to 5 cells", "at least 2 cells", "at most 5 cells", "up to 4 cells".`,
        });

        return [undefined, undefined];
    }

    const mainDist = parseInt(match[3]);
    if (mainDist === 0) {
        error({
            startIndex: match[1] === undefined
                ? startIndex
                : startIndex + match[1].length,
            length: 1,
            message: `Distance value must be greater than zero.`,
        });

        return [undefined, undefined];
    }
    
    switch (match[1]) {
        case undefined:
            return [mainDist, mainDist];
        case 'at least ':
            return [mainDist, undefined];
        case 'at most ':
        case 'up to ':
            return [1, mainDist];
    }
    
    const firstDist = parseInt(match[2]);
    
    if (firstDist === 0) {
        error({
            startIndex,
            length: 1,
            message: `Distance value must be greater than zero.`,
        });

        return [undefined, undefined];
    }

    if (firstDist >= mainDist) {
        const numberEnd = distance.lastIndexOf(' ');
        const numberStart = distance.lastIndexOf(' ', numberEnd - 1) + 1;

        error({
            startIndex: startIndex + match[1].length,
            length: distance.length - match[1].length,
            message: `Second distance value must be greater than the first value.`,
        });

        return [undefined, undefined];
    }

    return [firstDist, mainDist];
}