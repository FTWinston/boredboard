import { IParserError } from 'natural-configuration';
import { IPieceBehaviourOptions } from './parser';
import { CellContentFilter } from '../../PieceActionDefinition';

export function parseCellContentFilter(
    filterText: string,
    startIndex: number,
    options: IPieceBehaviourOptions,
    error: (error: IParserError) => void
): CellContentFilter {
    // TODO: actually parse this
    return (player, content) => false;

    error({
        startIndex,
        length: filterText.length,
        message: `Couldn't parse this cell content filter`,
    });
}