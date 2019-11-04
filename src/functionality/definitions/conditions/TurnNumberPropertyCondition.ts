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
    private readonly check: (value?: number) => boolean;

    constructor(
        private readonly property: ComparisonProperty,
        comparison: NumericComparison,
        value?: number
    ) {
        switch (comparison) {
            case NumericComparison.Equals:
                this.check = test => test === value;
                break;
            case NumericComparison.NotEqual:
                this.check = test => test !== value;
                break;
            case NumericComparison.LessThan:
                this.check = value === undefined
                    ? () => false
                    : test => test! < value;
                break;
            case NumericComparison.GreaterThan:
                this.check = value === undefined
                    ? () => false
                    : test => test! > value;
                break;
            case NumericComparison.LessThanOrEqual:
                this.check = value === undefined
                    ? () => false
                    : test => test! <= value;
                break;
            case NumericComparison.GreaterThanOrEqual:
                this.check = value === undefined
                    ? () => false
                    : test => test! >= value;
                break;
            default:
                this.check = () => false;
                break;
        }
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

        return this.check(comparisonValue);
    }

    public isActionValid() {
        return true;
    }
}