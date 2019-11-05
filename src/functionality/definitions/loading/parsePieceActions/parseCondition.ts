import { IParserError } from 'natural-configuration';
import { IStateCondition } from '../../conditions/IStateCondition';
import { IPieceBehaviourOptions } from './parser';
import { IMoveCondition } from '../../conditions/IMoveCondition';
import { TurnNumberPropertyCondition, ComparisonProperty } from '../../conditions/TurnNumberPropertyCondition';
import { NumericComparison } from '../../NumericComparison';

export function parseCondition(
    conditionText: string,
    error: (error: IParserError) => void,
    startIndex: number,
    stateConditions: IStateCondition[],
    moveConditions: IMoveCondition[],
    options?: IPieceBehaviourOptions,
): boolean {
    
    if (conditionText === 'has never moved') {
        stateConditions.push(new TurnNumberPropertyCondition(ComparisonProperty.FirstMove, NumericComparison.Equals, undefined));
        return true;
    }
    else if (conditionText === 'has moved') {
        stateConditions.push(new TurnNumberPropertyCondition(ComparisonProperty.FirstMove, NumericComparison.NotEqual, undefined));
        return true;
    }
    else if (conditionText === 'has never been threatened') {
        stateConditions.push(new TurnNumberPropertyCondition(ComparisonProperty.LastThreatened, NumericComparison.Equals, undefined));
        return true;
    }
    else if (conditionText === 'has been threatened') {
        stateConditions.push(new TurnNumberPropertyCondition(ComparisonProperty.LastThreatened, NumericComparison.NotEqual, undefined));
        return true;
    }

    // TODO: actually parse the rest of these ... probably use different regexes for each

    error({
        startIndex,
        length: conditionText.length,
        message: `Unrecognised condition.`,
    });

    return false;
}