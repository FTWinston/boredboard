import { Board } from './Board';
import { Piece } from './Piece';
import { GameDefinition } from '../definitions/GameDefinition';

export class Game {
    public readonly boards = new Map<string, Board>();
    public readonly pieces = new Set<Piece>();

    constructor(readonly definition: GameDefinition) {

    }
}