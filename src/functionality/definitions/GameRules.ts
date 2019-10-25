import { Dictionary } from '../../data/Dictionary';
import { IPiece } from '../instances/IPiece';
import { CellMoveability } from './CellCheckResult';

export class GameRules {
    constructor() {
        this.turnSequence = [];
        this.startRandomTurnSequence = false;
        this.testCellMovement = () => CellMoveability.StopOrContinue;
    }

    public turnSequence: number[];
    public startRandomTurnSequence: boolean;
    public maxCellOccupancy?: number;
    public testCellMovement: (piece: IPiece, contents: Dictionary<number, IPiece>) => CellMoveability;
}