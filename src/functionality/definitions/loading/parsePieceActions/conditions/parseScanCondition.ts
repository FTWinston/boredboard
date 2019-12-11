import { IParserError } from 'natural-configuration';
import { IStateCondition } from '../../../conditions/IStateCondition';
import { IPieceBehaviourOptions } from '../parser';
import { parsePieceFilter } from '../parsePieceFilter';
import { parsePieceConditions } from '../parsePieceConditions';
import { ScanCondition } from '../../../conditions/ScanCondition';
import { createCellFilter } from '../parseCellFilter';

// TODO: numeric comparison on the distance? at least, more than ... but also a "range" would be good
const scanExpression = new RegExp("^there (is|are) (.+?) (\\d+) cells? (?:to (?:its|the) )?(\\w+)(?: that (.+))?$");

export function parseScanCondition(
    conditionText: string,
    error: (error: IParserError) => void,
    startIndex: number,
    options?: IPieceBehaviourOptions,
): IStateCondition | null {
    // e.g. "there is a friendly rook 4 cells to its west that has never moved"
    //                [piece filter ] [   scan range    ] that [piece condition]
    
    const match = conditionText.match(scanExpression);

    if (match === null) {
        error({
            startIndex,
            length: conditionText.length,
            message: `Unrecognised scan condition: expected e.g. "there is a friendly rook 4 cells to the west that has never moved"`,
        });
    
        return null;
    }

    startIndex += 7 + match[1].length;
    const pieceFilterText = match[2];
    const [comparison, quantity, relation, type] = parsePieceFilter(pieceFilterText, startIndex, error);

    startIndex += pieceFilterText.length;
    const distanceText = match[3];
    const distance = parseInt(distanceText);

    const directionText = match[4];
    startIndex = conditionText.indexOf(directionText, startIndex);

    const direction  = directionText;

    startIndex += directionText.length + 6;
    const pieceConditionText = match[5];

    const pieceConditions = pieceConditionText === undefined
        ? []
        : parsePieceConditions(pieceConditionText, startIndex, options, error);

    const cellFilter = createCellFilter(type, relation, comparison, quantity, pieceConditions);

    return new ScanCondition(cellFilter, direction, distance, distance);
}