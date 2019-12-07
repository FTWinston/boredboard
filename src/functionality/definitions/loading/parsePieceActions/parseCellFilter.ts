import { IParserError } from 'natural-configuration';
import { IPieceBehaviourOptions } from './parser';
import { CellFilter } from '../../PieceActionDefinition';
import { parseRelationship } from './parseRelationship';
import { Relationship } from '../../Relationship';
import { isEmpty } from '../../../instances/functions/isEmpty';
import { parseCondition } from './parseCondition';
import { IStateCondition } from '../../conditions/IStateCondition';
import { IMoveCondition } from '../../conditions/IMoveCondition';

const filterExpression = new RegExp("^a(n empty)? cell(?: in (.+?))?(?: containing (.+))?$");
const pieceExpression = new RegExp("^(a|an|one|any|(\\d+)x?) (?:(.*?) )?(\\w+?)(?: that (.+))?$");

export function parseCellFilter(
    filterText: string,
    startIndex: number,
    options: IPieceBehaviourOptions,
    error: (error: IParserError) => void
): CellFilter {
    const filterMatch = filterText.match(filterExpression);
    if (filterMatch === null) {
        error({
            startIndex,
            length: filterText.length,
            message: `Couldn't understand this condition - expected e.g. "an empty cell" or "a cell containing an enemy piece"`,
        });

        return () => false;
    }

    let regionMatch = filterMatch[2];
    if (regionMatch === undefined) {
        regionMatch = '';
    }
    
    let containsMatch = filterMatch[3];
    if (containsMatch === undefined) {
        containsMatch = '';
    }

    if (filterMatch[1] !== undefined && filterMatch[1].length > 0) {
        // empty cell ... therefore "containing" should not be present
        if (containsMatch.length > 0) {
            error({
                startIndex,
                length: filterText.length,
                message: `Couldn't understand this condition - an empty cell cannot contain anything.`,
            });

            return () => false;
        }

        if (regionMatch.length > 0) {
            startIndex += 17;

            // TODO: account for region match
        }

        return (game, state, board, boardDef, cell) => {
            const content = board.cellContents[cell];
            return content === undefined || isEmpty(content);
        }
    }
    else if (containsMatch.length === 0 && regionMatch.length === 0) {
        // "a cell" isn't a valid filter ... is it? Oh why not, I guess.
        return () => true;
    }

    if (regionMatch.length > 0) {
        startIndex += 10;

        // TODO: account for region match

        startIndex += regionMatch.length;
    }
    else {
        startIndex += 18;
    }

    const match = containsMatch.match(pieceExpression);

    if (match === null) {
        error({
            startIndex,
            length: containsMatch.length,
            message: `Couldn't understand this cell content - expected e.g. "a friendly piece" or "an enemy king that has never moved"`,
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
        startIndex += 6;

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