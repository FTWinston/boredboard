import { IParserError } from 'natural-configuration';
import { TurnNumberPropertyCondition, ComparisonProperty } from '../../../conditions/TurnNumberPropertyCondition';
import { NumericComparison } from '../../../NumericComparison';
import { parseNumericComparison } from '../parseNumericComparison';

const moveExpression = new RegExp('^(first|last) moved (?:(.*?) )?(\\d+) turns? ago$')

export function parseMovedCondition(
    conditionText: string,
    error: (error: IParserError) => void,
    startIndex: number,
) {
    if (conditionText === 'has never moved') {
        return new TurnNumberPropertyCondition(ComparisonProperty.FirstMove, NumericComparison.Equals, undefined);
    }
    else if (conditionText === 'has moved') {
        return new TurnNumberPropertyCondition(ComparisonProperty.FirstMove, NumericComparison.NotEqual, undefined);
    }

    const match = conditionText.match(moveExpression);
    if (match === null) {
        error({
            startIndex,
            length: conditionText.length,
            message: `Unrecognised condition: ${conditionText} ... expected e.g. "has never moved" or "last moved at least 3 turns ago"`,
        })
        return null;
    }

    const property = match[1] === 'first'
        ? ComparisonProperty.FirstMove
        : ComparisonProperty.LastMove;

    const number = parseInt(match[3]);

    const comparisonText = match[2];
    const comparison = comparisonText === undefined || comparisonText.length === 0
        ? NumericComparison.Equals
        : parseNumericComparison(comparisonText, startIndex + match[1].length + 7, error);

    return comparison === null
        ? null
        : new TurnNumberPropertyCondition(property, comparison, number);
}