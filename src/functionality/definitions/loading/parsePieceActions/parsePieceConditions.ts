import { IParserError } from 'natural-configuration';
import { IPieceBehaviourOptions } from './parser';
import { parseCondition } from './parseCondition';
import { IStateCondition } from '../../conditions/IStateCondition';
import { IMoveCondition } from '../../conditions/IMoveCondition';

export function parsePieceConditions(
    filterText: string,
    startIndex: number,
    options: IPieceBehaviourOptions,
    error: (error: IParserError) => void
): IStateCondition[] {
    const stateConditions: IStateCondition[] = [];
    const moveConditions: IMoveCondition[] = [];

    const conditionTexts = filterText.split(' and ');

    for (const conditionText of conditionTexts) {
        const prevNumMove = moveConditions.length;

        if (!parseCondition(conditionText, error, startIndex, stateConditions, moveConditions, options)) {
            return [];
        }

        if (moveConditions.length !== prevNumMove) {
            error({
                startIndex,
                length: conditionText.length,
                message: 'Cannot use move conditions here.',
            });
        }

        startIndex += conditionText.length + 5;
    }

    return stateConditions;
}