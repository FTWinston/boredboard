import { IParserError } from 'natural-configuration';
import { TurnNumberPropertyCondition, ComparisonProperty } from '../../../conditions/TurnNumberPropertyCondition';
import { NumericComparison } from '../../../NumericComparison';
import { parseNumericComparison } from '../parseNumericComparison';

const moveExpression = new RegExp('^last threatened (?:(.*?) )?(\\d+) turns? ago$')

export function parseThreatenedCondition(
    conditionText: string,
    error: (error: IParserError) => void,
    startIndex: number,
) {
    if (conditionText === 'has never been threatened') {
        return new TurnNumberPropertyCondition(ComparisonProperty.LastThreatened, NumericComparison.Equals, undefined);
    }
    else if (conditionText === 'has been threatened') {
        return new TurnNumberPropertyCondition(ComparisonProperty.LastThreatened, NumericComparison.NotEqual, undefined);
    }

    const match = conditionText.match(moveExpression);
    if (match === null) {
        error({
            startIndex,
            length: conditionText.length,
            message: `Unrecognised condition: ${conditionText} ... expected e.g. "has never been threatened" or "last threatened at least 3 turns ago"`,
        })
        return null;
    }

    const property = ComparisonProperty.LastThreatened;

    const number = parseInt(match[2]);

    const comparisonText = match[1];
    const comparison = comparisonText === undefined || comparisonText.length === 0
        ? NumericComparison.Equals
        : parseNumericComparison(comparisonText, startIndex + 16, error);

    return comparison === null
        ? null
        : new TurnNumberPropertyCondition(property, comparison, number);
}