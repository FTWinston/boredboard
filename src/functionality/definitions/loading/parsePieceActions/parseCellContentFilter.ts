import { IParserError } from 'natural-configuration';
import { IPieceBehaviourOptions } from './parser';
import { CellContentFilter } from '../../PieceActionDefinition';
import { parseRelationship } from './parseRelationship';
import { Relationship } from '../../Relationship';
import { isEmpty } from '../../../instances/functions/isEmpty';
import { parseCondition } from './parseCondition';
import { IStateCondition } from '../../conditions/IStateCondition';
import { IMoveCondition } from '../../conditions/IMoveCondition';

const pieceExpression = new RegExp("^(a|an|one|any|(\\d+)x) (?:(.*) )?(\\w+?)(?: which (.+))?$");

export function parseCellContentFilter(
    filterText: string,
    startIndex: number,
    options: IPieceBehaviourOptions,
    error: (error: IParserError) => void
): CellContentFilter {
    if (filterText === 'an empty cell') {
        return (_player, content) => content === undefined || isEmpty(content);
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
            message: `Couldn't understand this cell content - expected e.g. "a friendly king" or "an enemy piece"`,
        });
        
        return () => false;
    }

    const quantity = match[2] === undefined
        ? 1
        : parseInt(match[2]);

    const relation = parseRelationship(match[3]);
    if (relation === Relationship.None) {
        error({
            startIndex,
            length: filterText.length,
            message: `Couldn't understand this relationship`,
        });

        return () => false;
    }

    const type = match[4] === 'piece' ? null : match[4];

    if (match[5] !== undefined) {
        const conditionTexts = match[5].split(' and ');
        const stateConditions: IStateCondition[] = [];
        const moveConditions: IMoveCondition[] = [];

        for (const conditionText of conditionTexts) {
            // TODO: parse conditions for the match piece
            /*
            if (!parseCondition(conditionText, error, startIndex + something, stateConditions, moveConditions, options)) {
                return () => false;
            }
            */
        }

        if (moveConditions.length > 0) {
            // cannot use moveConditions here
            return () => false;
        }

        // TODO: use stateConditions somehow
    }

    return (player, content) => {
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

            if (++num >= quantity) {
                return true;
            }
        }

        return false;
    };
}