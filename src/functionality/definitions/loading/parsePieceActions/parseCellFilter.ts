import { IParserError } from 'natural-configuration';
import { IPieceBehaviourOptions } from './parser';
import { CellFilter } from '../../PieceActionDefinition';
import { isEmpty } from '../../../instances/functions/isEmpty';
import { parsePieceFilter } from './parsePieceFilter';
import { parsePieceConditions } from './parsePieceConditions';

const filterExpression = new RegExp("^a(n empty)? cell(?: in (.+?))?(?: containing (.+))?$");

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


    const conditionStartPos = containsMatch.indexOf(' that ');
    const [comparison, quantity, relation, type] = parsePieceFilter(
        conditionStartPos === -1
            ? containsMatch
            : containsMatch.substr(0, conditionStartPos),
        startIndex,
        error,
    );

    const stateConditions = conditionStartPos === -1
        ? []
        : parsePieceConditions(
            containsMatch.substr(conditionStartPos + 6),
            startIndex + conditionStartPos + 6,
            options,
            error
        );

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

            num++;
        }

        return comparison(num, quantity);
    };
}