import { MoveType } from './MoveType';
import { PieceActionCondition } from './PieceActionCondition';

interface IPieceActionElement {
    readonly directions: ReadonlyArray<string>;
    readonly minDistance: number;
    readonly maxDistance?: number;
    readonly optional: boolean;
}

export class PieceActionDefinition {
    constructor(readonly moveType: MoveType, readonly moveSequence: ReadonlyArray<IPieceActionElement>, readonly conditions: PieceActionCondition[]) {
        
    }
}