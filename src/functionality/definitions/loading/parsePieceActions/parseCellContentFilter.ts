import { IParserError } from 'natural-configuration';
import { IPieceBehaviourOptions } from './parser';
import { CellContentFilter } from '../../PieceActionDefinition';
import { parseRelationship } from './parseRelationship';
import { Relationship } from '../../Relationship';
import { isEmpty } from '../../../instances/functions/isEmpty';
import { parseCondition } from './parseCondition';
import { IStateCondition } from '../../conditions/IStateCondition';
import { IMoveCondition } from '../../conditions/IMoveCondition';

const pieceExpression = new RegExp("^(a|an|one|any|(\\d+)x?) (?:(.*) )?(\\w+?)(?: which (.+))?$");

export function parseCellContentFilter(
    filterText: string,
    startIndex: number,
    options: IPieceBehaviourOptions,
    error: (error: IParserError) => void
): CellContentFilter {
    if (filterText === 'an empty cell') {
        return (game, state, board, boardDef, cell) => {
            const content = board.cellContents[cell];
            return content === undefined || isEmpty(content);
        }
    }

    if (!filterText.startsWith('a cell containing ')) {
        error({
            startIndex,
            length: filterText.length,
            message: `Couldn't understand this condition - expected e.g. "an empty cell" or "a cell containing an enemy piece"`,
        });

        return () => false;
    }
    
    startIndex += 18;
    filterText = filterText.substr(18);

    const match = filterText.match(pieceExpression);

    if (match === null) {
        error({
            startIndex,
            length: filterText.length,
            message: `Couldn't understand this cell content - expected e.g. "a friendly piece" or "an enemy king which has never moved"`,
        });
        
        return () => false;
    }

    const quantity = match[2] === undefined
        ? 1
        : parseInt(match[2]);

    startIndex += match[1].length + 1;

    const relation = parseRelationship(match[3]);
    if (relation === Relationship.None) {
        error({
            startIndex,
            length: match[3].length,
            message: `Couldn't understand this relationship`,
        });

        return () => false;
    }

    if (match[3] !== undefined) {
        startIndex += match[3].length + 1;
    }

    const type = match[4] === 'piece' ? null : match[4];

    startIndex += match[4].length;

    const stateConditions: IStateCondition[] = [];

    if (match[5] !== undefined) {
        // parse conditions for the filter-matching piece, not the acting piece
        startIndex += 7;

        const conditionTexts = match[5].split(' and ');
        const moveConditions: IMoveCondition[] = [];

        for (const conditionText of conditionTexts) {
            if (!parseCondition(conditionText, error, startIndex, stateConditions, moveConditions, options)) {
                return () => false;
            }

            startIndex += conditionText.length + 5;
        }

        if (moveConditions.length > 0) {
            // cannot use moveConditions here
            return () => false;
        }
    }

    return (game, state, board, boardDef, cell, player) => {
        const content = board.cellContents[cell];
        if (content === undefined) {
            return false;
        }
        
        let num = 0;

        for (const id in content) {
            const piece = content[id]!;
            const relationship = options.game.rules.getRelationship(player, piece.owner);

            if ((relationship & relation) === 0) {
                continue;
            }

            if (type !== null && piece.definition !== type) {
                continue;
            }

            const allValid = stateConditions.every(condition => condition.isValid(game, state, board, boardDef, cell, piece));
            if (!allValid) {
                continue;
            }

            if (++num >= quantity) {
                return true;
            }
        }

        return false;
    };
}