import { PieceDefinition } from '../definitions/PieceDefinition';

export class Piece {
    constructor(
        readonly definition: PieceDefinition,
        public owner: number,
        public board: string,
        public cell: string
    ) {
        
    }
}