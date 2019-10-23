import { IParserError } from 'natural-configuration';
import { IPieceActionCondition } from '../../IPieceActionCondition';
import { IPieceBehaviourOptions } from './parser';

export function parsePieceActionCondition(
    conditionText: string,
    error: (error: IParserError) => void,
    startIndex: number,
    conditionSequence: IPieceActionCondition[],
    options?: IPieceBehaviourOptions,
): boolean {
    // TODO: actually parse these

    error({
        startIndex,
        length: conditionText.length,
        message: `Unrecognised condition.`,
    });

    return false;
}