export class GameRules {
    constructor() {
        this.turnSequence = [];
        this.startRandomTurnSequence = false;
    }

    public turnSequence: number[];
    public startRandomTurnSequence: boolean;
    public maxCellOccupancy?: number;
}