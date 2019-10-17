import { MoveType } from './MoveType';

export class PieceActionDefinition {
    constructor(readonly moveType: MoveType, readonly direction: string, readonly minDistance: number, readonly maxDistance?: number) {
        
    }
}