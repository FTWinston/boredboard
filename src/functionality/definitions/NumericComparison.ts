export type NumericComparison = (value1?: number, value2?: number) => boolean;

export const alwaysSucceeds: NumericComparison = () => true;

export const alwaysFails: NumericComparison = () => false;

export const equals: NumericComparison = (value1?: number, value2?: number) => value1 === value2;

export const atLeast: NumericComparison = (value1?: number, value2?: number) => value1 !== undefined && value2 !== undefined && value1 >= value2;

export const atMost: NumericComparison = (value1?: number, value2?: number) => value1 !== undefined && value2 !== undefined && value1 <= value2;

export const greaterThan: NumericComparison = (value1?: number, value2?: number) => value1 !== undefined && value2 !== undefined && value1 > value2;

export const lessThan: NumericComparison = (value1?: number, value2?: number) => value1 !== undefined && value2 !== undefined && value1 < value2;

export const notEqual: NumericComparison = (value1?: number, value2?: number) => value1 !== value2;