import { ConfigurationParser, IParserError } from 'natural-configuration';
import { PieceActionDefinition } from './PieceActionDefinition';
import { MoveType } from './MoveType';

const parser = new ConfigurationParser<PieceActionDefinition[]>([
    {
        type: 'standard',
        expressionText: 'It can (\\w+) (any distance|(at least |at most |up to |\\d+ to )?(\\d+) cells?) (.+)',
        parseMatch: (match, action, error) => {
            let success = true;
            
            const strMoveType = match[1].toLowerCase();
            let moveType: MoveType;

            switch (strMoveType) {
                case 'slide':
                    moveType = MoveType.Slide;
                    break;
                case 'leap':
                    moveType = MoveType.Leap;
                    break;
                case 'hop':
                    moveType = MoveType.Hop;
                    break;
                default:
                    error({
                        startIndex: 7,
                        length: strMoveType.length,
                        message: `Unrecognised move type: ${strMoveType}. Allowed values are: slide, leap or hop.`,
                    });
                    success = false;
                    break;
            }

            /*
            if (match[1].length === 0) {
                error({
                    startIndex: 8,
                    length: 2,
                    message: 'Match text cannot be empty.'
                });
        
                return;
            }
        
            const before = new RegExp(match[1], 'g');
            const after = match[2];
        
            action(modify => modify.value = modify.value.replace(before, after));
            */

            const minDistance = 1;
            const maxDistance = undefined;
            const direction = 'forward';

            if (success) {
                action(modify => modify.push(new PieceActionDefinition(moveType, direction, minDistance, maxDistance)));
            }
        },
        examples: [
            'It can slide any distance diagonally',
            'It can hop up to 3 cells orthogonally',
            'It can leap 2 to 4 cells orthogonally',
            'It can slide 1 cell forward',
            'It can leap 2 cells diagonally',
            'It can slide at least 2 cells orthogonally',
        ]
    },
]);

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