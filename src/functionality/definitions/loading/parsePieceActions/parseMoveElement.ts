import { IParserError } from 'natural-configuration';
import { parseDistance } from './parseDistance';
import { parseDirections } from './parseDirections';
import { IPieceBehaviourOptions } from './parser';
import { IPieceActionElement, CellContentFilter } from '../../PieceActionDefinition';
import { parseCellContentFilter } from './parseCellContentFilter';

export function parseMoveElement(
    elementText: string,
    startIndex: number,
    error: (error: IParserError) => void,
    optional: boolean,
    moveSequence: IPieceActionElement[],
    options: IPieceBehaviourOptions,
): boolean {
    let minDistance: number | undefined;
    let maxDistance: number | undefined;

    if (elementText.startsWith('any distance ')) {
        minDistance = 1;
        elementText = elementText.substr(13);
        startIndex += 13;
    }
    else {
        let distanceEndsAt = elementText.indexOf(' cells ');
        let skipLength: number;
        if (distanceEndsAt === -1) {
            distanceEndsAt = elementText.indexOf(' cell ');
            skipLength = 6;
        }
        else {
            skipLength = 7;
        }

        if (distanceEndsAt === -1) {
            if (distanceEndsAt === -1) {
                error({
                    startIndex,
                    length: elementText.length,
                    message: `Cannot interpret this movement element. Expected e.g. "2 to 4 cells diagonally".`,
                });

                return false;
            }
        }
    
        [minDistance, maxDistance] = parseDistance(elementText.substr(0, distanceEndsAt), startIndex, error);

        startIndex += distanceEndsAt + skipLength;
        elementText = elementText.substr(distanceEndsAt + skipLength);
    }

    // if there's a " to " anywhere in the subsequent statement, anything after that is an occupancy check
    const toPos = elementText.indexOf(' to ', startIndex);

    const directionText = toPos === -1
        ? elementText
        : elementText.substring(0, toPos);

    const directions = parseDirections(directionText, startIndex, options.allowedDirections, error);

    if (minDistance === undefined || directions.length === 0) {
        return false;
    }

    let destinationCheck: CellContentFilter | undefined;

    if (toPos !== -1) {
        startIndex += directionText.length + 4;
        elementText = elementText.substr(toPos + 4);
        destinationCheck = parseCellContentFilter(elementText, startIndex, options, error);
    }

    moveSequence.push({
        directions,
        minDistance,
        maxDistance,
        optional,
        destinationCheck,
    });

    return true;
}