import { IStateCondition } from './IStateCondition';
import { IGameState } from '../../instances/IGameState';
import { GameDefinition } from '../GameDefinition';
import { IPiece } from '../../instances/IPiece';
import { BoardDefinition } from '../BoardDefinition';
import { IBoard } from '../../instances/IBoard';
import { NumericComparison } from '../NumericComparison';

export enum ComparisonProperty {
    FirstMove,
    LastMove,
    LastThreatened,
}

export class TurnNumberPropertyCondition implements IStateCondition {
    constructor(
        private readonly property: ComparisonProperty,
        private readonly comparison: NumericComparison,
        private readonly value?: number
    ) {

    }

    public isValid(
        game: GameDefinition,
        state: IGameState,
        boardState: IBoard,
        boardDef: BoardDefinition,
        cell: string,
        piece: IPiece,
    ) {
        let propertyValue: number | undefined;

        switch (this.property) {
            case ComparisonProperty.FirstMove:
                propertyValue = piece.firstMove;
                break;
            case ComparisonProperty.LastMove:
                propertyValue = piece.lastMove;
                break;
            case ComparisonProperty.LastThreatened:
                propertyValue = piece.lastThreatened;
                break;
            default:
                return false;
        }

        const comparisonValue = propertyValue === undefined 
            ? undefined
            : state.currentTurn - propertyValue;

        return this.comparison(comparisonValue, this.value);
    }

    public isActionValid() {
        return true;
    }
}