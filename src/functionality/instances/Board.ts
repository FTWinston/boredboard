import { BoardDefinition } from '../definitions/BoardDefinition';
import { Piece } from './Piece';

export class Board {
    public readonly cellContents = new Map<string, Piece[]>();
    
    constructor(readonly definition: BoardDefinition) {
        
    }
}