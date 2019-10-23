import { IParserError } from 'natural-configuration';
import { MoveType } from '../../MoveType';

export function parseMoveType(moveType: string, startIndex: number, error: (error: IParserError) => void) {
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