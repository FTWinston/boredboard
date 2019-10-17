import { ConfigurationParser, IParserError } from 'natural-configuration';
import { PieceActionDefinition } from './PieceActionDefinition';

const parser = new ConfigurationParser<PieceActionDefinition[]>([

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