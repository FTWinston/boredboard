import { ConfigurationParser } from 'natural-configuration';
import { PieceActionDefinition } from '../../PieceActionDefinition';
import { IPieceActionCondition } from '../../IPieceActionCondition';
import { parseMoveType } from './parseMoveType';
import { parsePieceActionCondition } from './parsePieceActionCondition';
import { parseMoveElement } from './parseMoveElement';

export interface IPieceBehaviourOptions {
    allowedDirections: ReadonlySet<string>;
}

export interface IActionElement {
    directions: Array<string>;
    minDistance: number;
    maxDistance?: number;
    optional: boolean;
}

export const parser = new ConfigurationParser<PieceActionDefinition[], IPieceBehaviourOptions>([
    {
        type: 'standard',
        expressionText: '(?:If (.+?), it|It) can ((\\w+) (.+?)( then (optionally )?(.+?))*)',
        parseMatch: (match, action, error, options) => {
            let success = true;
            let groupStartPos: number;

            const strConditions = match[1];
            const conditions: IPieceActionCondition[] = [];
            
            if (strConditions !== undefined) {
                groupStartPos = 3;
                for (const strCondition of strConditions.split(' and ')) {
                    success = success && parsePieceActionCondition(strCondition, error, groupStartPos, conditions, options);
                    groupStartPos += strCondition.length + 5;
                }

                groupStartPos += 4;
            }
            else {
                groupStartPos = 7;
            }

            const strMoveType = match[3];
            const moveType = parseMoveType(strMoveType, groupStartPos, error);
            groupStartPos += strMoveType.length + 1;

            if (moveType === undefined) {
                success = false;
            }

            const moveSequence: IActionElement[] = [];

            const firstMove = match[4];
            success = success && parseMoveElement(firstMove, groupStartPos, error, false, moveSequence, options);
            groupStartPos += firstMove.length;

            const subsequentMoves = match[2].split(' then ');
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