import { PieceActionDefinition } from './PieceActionDefinition';

export class PieceDefinition {
    public readonly actions: ReadonlyArray<PieceActionDefinition>;

    constructor(readonly value: number, actions: PieceActionDefinition[]) {
        this.actions = actions;
    }
}