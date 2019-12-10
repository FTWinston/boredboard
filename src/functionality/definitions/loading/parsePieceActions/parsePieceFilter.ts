import { IParserError } from 'natural-configuration';
import { parseRelationship } from './parseRelationship';
import { Relationship } from '../../Relationship';
import { parseNumericComparison } from './parseNumericComparison';
import { equals, NumericComparison, alwaysFails } from '../../NumericComparison';

const pieceExpression = new RegExp("^(?:(.+?) )?(a|an|one|any|(\\d+)x?) (?:(.+?) )?(\\w+)$");

const failResult: [NumericComparison, number, Relationship, string | null] = [alwaysFails, 1, Relationship.None, null];

export function parsePieceFilter(
    filterText: string,
    startIndex: number,
    error: (error: IParserError) => void
): [NumericComparison, number, Relationship, string | null] {
    const match = filterText.match(pieceExpression);

    if (match === null) {
        error({
            startIndex,
            length: filterText.length,
            message: `Couldn't understand this piece filter - expected e.g. "a friendly piece" or "a king"`,
        });
        
        return failResult;
    }

    const comparison = match[1] === undefined
        ? equals
        : parseNumericComparison(match[1], startIndex, error);

    if (comparison === null) {
        return failResult;
    }

    const quantity = match[3] === undefined
        ? 1
        : parseInt(match[3]);

    startIndex += match[2].length + 1;

    const relation = parseRelationship(match[4]);
    if (relation === Relationship.None) {
        error({
            startIndex,
            length: match[4].length,
            message: `Couldn't understand this relationship`,
        });

        return failResult;
    }

    if (match[3] !== undefined) {
        startIndex += match[3].length + 1;
    }

    const type = match[4] === 'piece' || match[4] === 'pieces'
        ? null
        : match[4];

    return [comparison, quantity, relation, type];
}