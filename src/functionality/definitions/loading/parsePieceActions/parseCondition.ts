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
    // ignore "it" or "that" on first word here ... it could be either depending on context. However other first words can differ.
    if (conditionText.startsWith('it ')) {
        conditionText = conditionText.substr(3);
    }
    else if (conditionText.startsWith('that ')) {
        conditionText = conditionText.substr(5);
    }

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
    else if (conditionText === 'first moved 1 turn ago') {
        // TODO: actually parse these properly
        stateConditions.push(new TurnNumberPropertyCondition(ComparisonProperty.FirstMove, NumericComparison.Equals, 1));
        return true;
    }

    error({
        startIndex,
        length: conditionText.length,
        message: `Unrecognised condition: ${conditionText}`,
    });

    return false;
}