import { IPlayerAction } from '../instances/IPlayerAction';

export class PieceActionCondition {
    constructor(readonly attacking?: boolean) {
        
    }

    public isValid(action: IPlayerAction): boolean {
        return true; // TODO: validate this
    }
}