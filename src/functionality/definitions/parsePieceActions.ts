import { ConfigurationParser, IParserError } from 'natural-configuration';
import { PieceActionDefinition } from './PieceActionDefinition';
import { MoveType } from './MoveType';
import { PieceActionCondition } from './PieceActionCondition';

interface IPieceBehaviourOptions {
    allowedDirections: Set<string>;
}

interface IActionElement {
    directions: Array<string>;
    minDistance: number;
    maxDistance?: number;
    optional: boolean;
}

const parser = new ConfigurationParser<PieceActionDefinition[], IPieceBehaviourOptions>([
    {
        type: 'standard',
        expressionText: 'It can (\\w+) (.+?)( then (optionally )?(.+?))*',
        parseMatch: (match, action, error, options) => {
            let success = true;
            let groupStartPos = 7;
            const strMoveType = match[1];
            const moveType = parseMoveType(strMoveType, groupStartPos, error);
            groupStartPos += strMoveType.length + 1;

            if (moveType === undefined) {
                success = false;
            }

            const moveSequence: IActionElement[] = [];

            const firstMove = match[2];
            success = success && parseMoveElement(firstMove, groupStartPos, error, false, moveSequence, options);
            groupStartPos += firstMove.length;

            const subsequentMoves = match[0].split(' then ');
            subsequentMoves.splice(0, 1);

            for (let move of subsequentMoves) {
                let optional;
                if (move.startsWith('optionally ')) {
                    optional = true;
                    move = move.substr(11);
                    groupStartPos += 11;
                }
                else {
                    optional = false;
                }

                success = success && parseMoveElement(move, groupStartPos, error, optional, moveSequence, options);
            }

            const conditions: PieceActionCondition[] = [];

            if (success) {
                action(modify => modify.push(new PieceActionDefinition(moveType!, moveSequence, conditions)));
            }
        },
        examples: [
            'It can slide 1 cell forward',
            'It can slide any distance diagonally',
            'It can hop up to 3 cells orthogonally',
            'It can leap 2 to 4 cells orthogonally',
            'It can leap 2 cells diagonally',
            'It can slide at least 2 cells orthogonally',
            'It can leap 2 to 4 cells horizontally or vertically.',
            'It can slide any distance orthogonally or diagonally.',
        ]
    },
]);

function parseMoveElement(
    elementText: string,
    startIndex: number,
    error: (error: IParserError) => void,
    optional: boolean,
    moveSequence: IActionElement[],
    options?: IPieceBehaviourOptions,
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

    const directions = parseDirections(elementText, startIndex, options === undefined ? undefined : options.allowedDirections, error);

    if (minDistance === undefined || directions.length === 0) {
        return false;
    }
    
    moveSequence.push({
        directions,
        minDistance,
        maxDistance,
        optional,
    });

    return true;
}

function parseMoveType(moveType: string, startIndex: number, error: (error: IParserError) => void) {
    switch (moveType.toLowerCase()) {
        case 'slide':
            return MoveType.Slide;
        case 'leap':
            return MoveType.Leap;
        case 'hop':
            return MoveType.Hop;
    }

    error({
        startIndex,
        length: moveType.length,
        message: `Unrecognised move type: ${moveType}. Allowed values are: slide, leap or hop.`,
    });
}

const distanceExpression = new RegExp("^(at least |at most |up to |(\\d+)(?: to |-| - |))?(\\d+)$");

function parseDistance(
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

function parseDirections(
    directionsText: string,
    startIndex: number,
    allowedDirections: Set<string> | undefined,
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

type ParseResult = {
    success: true;
    definition: PieceActionDefinition[];
} | {
    success: false;
    errors: IParserError[];
}

export function parsePieceActions(behaviour: string, allowedDirections: Set<string>): ParseResult {
    const definition: PieceActionDefinition[] = [];
    
    const options = {
        allowedDirections,
    };

    const errors = parser.configure(behaviour, definition, options);

    return errors.length === 0
        ? {
            success: true,
            definition,
        }
        : {
            success: false,
            errors: errors,
        };
}