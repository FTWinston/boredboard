import { ConfigurationParser, IParserError } from 'natural-configuration';
import { PieceActionDefinition } from './PieceActionDefinition';
import { MoveType } from './MoveType';
import { CellSelector } from '../editor/board/pages/CellSelector';

const parser = new ConfigurationParser<PieceActionDefinition[]>([
    {
        type: 'standard',
        expressionText: 'It can (?<moveType>\\w+) (?<distance>any distance|.+ cells?) (?<direction>.+)',
        parseMatch: (match, action, error) => {
            let success = true;
            const groups = match.groups!;
            
            let groupStartPos = 7;
            const strMoveType = groups['moveType'];
            const moveType = parseMoveType(strMoveType, groupStartPos, error);
            if (moveType === undefined) {
                success = false;
            }

            groupStartPos += strMoveType.length + 1;
            const [minDistance, maxDistance] = parseDistance(groups['distance'], groupStartPos, error);
            if (minDistance === undefined) {
                success = false;
            }

            const direction = groups['direction'];
            
            // console.log('match', match);

            if (success) {
                action(modify => modify.push(new PieceActionDefinition(moveType!, direction, minDistance!, maxDistance)));
            }
        },
        examples: [
            'It can slide 1 cell forward',
            'It can slide any distance diagonally',
            'It can hop up to 3 cells orthogonally',
            'It can leap 2 to 4 cells orthogonally',
            'It can leap 2 cells diagonally',
            'It can slide at least 2 cells orthogonally',
        ]
    },
]);

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
    distance: string, startIndex: number, error: (error: IParserError) => void
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