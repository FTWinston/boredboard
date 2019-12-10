import { IParserError } from 'natural-configuration';
import { NumericComparison, alwaysFails, equals, atLeast, atMost, greaterThan, lessThan, notEqual } from '../../NumericComparison';

export function parseNumericComparison(text: string, startIndex: number, error: (error: IParserError) => void): NumericComparison {
    switch (text.toLowerCase()) {
        case 'exactly':
            return equals;
        case 'at least':
            return atLeast;
        case 'at most':
            return atMost;
        case 'more than':
            return greaterThan;
        case 'less than':
            return lessThan;
        case 'not':
            return notEqual;
    }
    
    error({
        startIndex,
        length: text.length,
        message: `Unrecognised numeric comparison: ${text}. Expected e.g. exactly, at least, at most, more than, less than.`,
    });

    return alwaysFails;
}