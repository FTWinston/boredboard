import { PieceActionDefinition } from './PieceActionDefinition';
import { GameDefinition } from './GameDefinition';

export class PieceDefinition {
    constructor(
        private readonly game: GameDefinition,
        readonly value: number,
        readonly actions: ReadonlyArray<PieceActionDefinition>,
        readonly imageUrls: ReadonlyMap<number, string>
    ) { }
}