import { parser } from './parser';
import { PieceActionDefinition } from '../../PieceActionDefinition';
import { IParserError } from 'natural-configuration/lib/IParserError';

type ParseResult = {
    success: true;
    definition: PieceActionDefinition[];
} | {
    success: false;
    errors: IParserError[];
}

export function parsePieceActions(behaviour: string, allowedDirections: ReadonlySet<string>): ParseResult {
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