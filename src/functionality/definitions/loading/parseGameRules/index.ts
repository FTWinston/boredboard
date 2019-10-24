import { parser } from './parser';
import { IParserError } from 'natural-configuration/lib/IParserError';
import { BoardDefinition } from '../../BoardDefinition';
import { PieceDefinition } from '../../PieceDefinition';
import { GameRules } from '../../GameRules';

type ParseResult = {
    success: true;
    rules: GameRules;
} | {
    success: false;
    errors: IParserError[];
}

export function parseGameRules(rulesText: string, boards: ReadonlyMap<string, BoardDefinition>, pieces: ReadonlyMap<string, PieceDefinition>, numPlayers: number): ParseResult {
    const rules = new GameRules();
    
    const options = {
        numPlayers,
        boards,
        pieces,
    };

    const errors = parser.configure(rulesText, rules, options);

    return errors.length === 0
        ? {
            success: true,
            rules,
        }
        : {
            success: false,
            errors: errors,
        };
}