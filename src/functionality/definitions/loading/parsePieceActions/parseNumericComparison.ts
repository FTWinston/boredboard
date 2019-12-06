import { IParserError } from 'natural-configuration';
import { NumericComparison } from '../../NumericComparison';

export function parseNumericComparison(text: string, startIndex: number, error: (error: IParserError) => void) {
    switch (text.toLowerCase()) {
        case 'exactly':
            return NumericComparison.Equals;
        case 'at least':
            return NumericComparison.GreaterThanOrEqual;
        case 'at most':
            return NumericComparison.LessThanOrEqual;
        case 'more than':
            return NumericComparison.GreaterThan;
        case 'less than':
            return NumericComparison.GreaterThan;
        case 'not':
            return NumericComparison.NotEqual;
    }
    
    error({
        startIndex,
        length: text.length,
        message: `Unrecognised numeric comparison: ${text}. Expected e.g. exactly, at least, at most, more than, less than.`,
    });
    return null;
}