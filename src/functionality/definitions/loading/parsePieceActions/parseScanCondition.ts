import { IParserError } from 'natural-configuration';
import { IStateCondition } from '../../conditions/IStateCondition';
import { IPieceBehaviourOptions } from './parser';
import { parsePieceFilter } from './parsePieceFilter';
import { parsePieceConditions } from './parsePieceConditions';

// TODO: numeric comparison on the distance? at least, more than ... but also a "range" would be good
const scanExpression = new RegExp("^there is (.+?) (\d+) cells? (?:to the )?(\w+)(?: that (.+))?$");

export function parseScanCondition(
    conditionText: string,
    error: (error: IParserError) => void,
    startIndex: number,
    options: IPieceBehaviourOptions,
): IStateCondition | null {
    // TODO: parse scan condition, use parsePiecefilter and parsePieceConditions
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

    startIndex += 9;
    const pieceFilterText = match[1];
    const [comparison, quantity, relation, type] = parsePieceFilter(pieceFilterText, startIndex, error);

    startIndex += pieceFilterText.length;
    const distanceText = match[2];
    const distance = parseInt(distanceText);

    const directionText = match[3];
    startIndex = conditionText.indexOf(directionText, startIndex);
    const direction  = directionText; // TODO: parse direction text

    startIndex += directionText.length + 6;
    const pieceConditionText = match[4];

    const pieceConditions = pieceConditionText === undefined
        ? []
        : parsePieceConditions(pieceConditionText, startIndex, options, error);

    // TODO: create condition

    // TODO: also see if any of these things above failed

    error({
        startIndex,
        length: conditionText.length,
        message: `Unrecognised condition: ${conditionText}`,
    });

    return null;
}