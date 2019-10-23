import { IParserError } from 'natural-configuration';

export function parseDirections(
    directionsText: string,
    startIndex: number,
    allowedDirections: ReadonlySet<string> | undefined,
    error: (error: IParserError) => void
): string[] {
    const directions = directionsText.split(' or ');
    let allValid = true;

    for (let i = 0; i < directions.length; i++) {
        const direction = directions[i];

        if (allowedDirections !== undefined && !allowedDirections.has(direction)) {
            error({
                startIndex,
                length: direction.length,
                message: `Unrecognised direction. Allowed values are: "${[...allowedDirections].join('", "')}"`,
            });

            allValid = false;
        }

        startIndex += direction.length + 4;
    }
    
    return allValid
        ? directions
        : [];
}