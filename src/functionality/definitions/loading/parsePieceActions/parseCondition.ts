import { IParserError } from 'natural-configuration';
import { IStateCondition } from '../../conditions/IStateCondition';
import { IPieceBehaviourOptions } from './parser';
import { IMoveCondition } from '../../conditions/IMoveCondition';
import { parseRegionCondition } from './conditions/parseRegionCondition';
import { parseThreatenedCondition } from './conditions/parseThreatenedCondition';
import { parseMovedCondition } from './conditions/parseMovedCondition';

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

    if (conditionText.startsWith('is in')) {
        const condition = parseRegionCondition(conditionText, error, startIndex);
        if (condition === null) {
            return false;
        }

        stateConditions.push(condition);
        return true;
    }
    else if (conditionText.startsWith('there is')) {
        // TODO: parse scan condition, use parsePiecefilter and parsePieceConditions
        // e.g. "there is a friendly rook 4 cells to its west that has never moved"
        //                [piece filter ] [   scan range    ] that [piece condition]
        return true;
    }
    else if (conditionText.indexOf(' moved') !== -1) {
        const condition = parseMovedCondition(conditionText, error, startIndex);
        if (condition === null) {
            return false;
        }

        stateConditions.push(condition);
        return true;
    }
    else if (conditionText.indexOf(' threatened') !== -1) {
        const condition = parseThreatenedCondition(conditionText, error, startIndex);
        if (condition === null) {
            return false;
        }

        stateConditions.push(condition);
        return true;
    }

    error({
        startIndex,
        length: conditionText.length,
        message: `Unrecognised condition: ${conditionText}`,
    });

    return false;
}