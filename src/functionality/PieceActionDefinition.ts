export class PieceActionDefinition {
    constructor(readonly direction: string, readonly minDistance: number, readonly maxDistance?: number) {
        
    }
}