import { ConfigurationParser, IParserError } from 'natural-configuration';
import { PieceActionDefinition } from './PieceActionDefinition';
import { MoveType } from './MoveType';

interface IActionElement {
    directions: Array<string>;
    minDistance: number;
    maxDistance?: number;
    optional: boolean;
}

const parser = new ConfigurationParser<PieceActionDefinition[]>([
    {
        type: 'standard',
        expressionText: 'It can (\\w+) (any distance|.+? cells?) (.+?)(?: or (.+?))?(?: (then) (optionally )?(any distance|.+? cells?) (.+?)(?: or (.+?))?)*',
        parseMatch: (match, action, error) => {
            const moveSequence: IActionElement[] = [];
            let success = true;
            let iNextMatch = 1;
            let groupStartPos = 7;

            const strMoveType = match[iNextMatch++];
            const moveType = parseMoveType(strMoveType, groupStartPos, error);
            groupStartPos += strMoveType.length + 1;

            if (moveType === undefined) {
                success = false;
            }

            [iNextMatch, groupStartPos, success] = parseMoveElement(match, iNextMatch, groupStartPos, error, success, false, moveSequence);

            // now into repeating "then" sections
            while (iNextMatch < match.length) {
                const nextMatch = match[iNextMatch++];
                if (nextMatch === undefined){
                    break;
                }
                else if (nextMatch === 'then') {
                    groupStartPos += 6;

                    const optional = match[iNextMatch++] === 'optionally ';
                    
                    if (optional) {
                        groupStartPos += 12;
                    }

                    [iNextMatch, groupStartPos, success] = parseMoveElement(match, iNextMatch, groupStartPos, error, success, optional, moveSequence);
                }
                else {        
                    error({
                        startIndex: groupStartPos,
                        length: match.length - groupStartPos,
                        message: `Don't understand the end of this rule.`,
                    });
                    return
                }
            }

            if (success) {
                action(modify => modify.push(new PieceActionDefinition(moveType!, moveSequence)));
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
    match: RegExpExecArray,
    iNextMatch: number,
    groupStartPos: number,
    error: (error: IParserError) => void,
    success: boolean,
    optional: boolean,
    moveSequence: IActionElement[]
): [number, number, boolean] {
    const strDistance = match[iNextMatch++];
    
    const [minDistance, maxDistance] = parseDistance(strDistance, groupStartPos, error);
    groupStartPos += strDistance.length + 1;

    const directions: string[] = [];
    groupStartPos = parseDirections(
        match[iNextMatch++],
        match[iNextMatch++],
        groupStartPos,
        directions,
        error
    );

    if (minDistance === undefined || directions.length === 0) {
        success = false;
    }
    else {
        moveSequence.push({
            directions,
            minDistance,
            maxDistance,
            optional,
        });
    }

    return [iNextMatch, groupStartPos, success];
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

const distanceExpression = new RegExp("(?:(?<distType>at least|at most|up to|(?<firstDist>\\d+) to) )?(?<mainDist>\\d+) cells?");

function parseDistance(
    distance: string,
    startIndex: number,
    error: (error: IParserError) => void
): [number | undefined, number | undefined] {
    if (distance === 'any distance') {
        return [1, undefined];
    }

    const match = distance.match(distanceExpression);
    
    if (match === null) {
        error({
            startIndex,
            length: distance.length,
            message: `Unrecognised distance: ${distance}. Valid distances include: "any distance", "1 cell", "up to 3 cells", "2 to 5 cells", "at least 2 cells", "at most 5 cells", "up to 4 cells".`,
        });

        return [undefined, undefined];
    }

    const mainDist = parseInt(match.groups!['mainDist']);
    if (mainDist === 0) {
        error({
            startIndex: startIndex + distance.lastIndexOf(' ') - 1,
            length: 1,
            message: `Distance value must be greater than zero.`,
        });

        return [undefined, undefined];
    }
    
    switch (match.groups!['distType']) {
        case undefined:
            return [mainDist, mainDist];
        case 'at least':
            return [mainDist, undefined];
        case 'at most':
        case 'up to':
            return [1, mainDist];
    }
    
    const firstDist = parseInt(match.groups!['firstDist']);
    
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
            startIndex: startIndex + numberStart,
            length: numberEnd - numberStart,
            message: `Second distance value must be greater than the first value.`,
        });

        return [undefined, undefined];
    }

    return [firstDist, mainDist];
}

type ParseResult = {
    success: true;
    definition: PieceActionDefinition[];
} | {
    success: false;
    errors: IParserError[];
}

function parseDirections(
    direction: string,
    direction2: string | undefined,
    groupStartPos: number,
    directions: string[],
    error: (error: IParserError) => void
) {
    // TODO: ensure direction is valid
    directions.push(direction);
    groupStartPos += direction.length;

    if (direction2 !== undefined) {
        groupStartPos += direction2.length + 4;

        // TODO: ensure direction2 is valid
        directions.push(direction2);
    }

    return groupStartPos;
}

export function parsePieceActions(behaviour: string): ParseResult {
    const definitions: PieceActionDefinition[] = [];

    const errors = parser.configure(behaviour, definitions);

    return errors.length === 0
        ? {
            success: true,
            definition: definitions,
        }
        : {
            success: false,
            errors: errors,
        };
}