import { IParserError } from 'natural-configuration';
import { TurnNumberPropertyCondition, ComparisonProperty } from '../../../conditions/TurnNumberPropertyCondition';
import { NumericComparison } from '../../../NumericComparison';

export function parseThreatenedCondition(
    conditionText: string,
    error: (error: IParserError) => void,
    startIndex: number,
) {
    // TODO: parse these properly
    if (conditionText === 'has never been threatened') {
        return new TurnNumberPropertyCondition(ComparisonProperty.LastThreatened, NumericComparison.Equals, undefined);
    }
    else if (conditionText === 'has been threatened') {
        return new TurnNumberPropertyCondition(ComparisonProperty.LastThreatened, NumericComparison.NotEqual, undefined);
    }

    return null;
}