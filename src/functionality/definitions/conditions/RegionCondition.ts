import { IStateCondition } from './IStateCondition';
import { IGameState } from '../../instances/IGameState';
import { GameDefinition } from '../GameDefinition';
import { IPiece } from '../../instances/IPiece';
import { BoardDefinition } from '../BoardDefinition';
import { IBoard } from '../../instances/IBoard';
import { Relationship } from '../Relationship';

export class RegionCondition implements IStateCondition {
    constructor(
        readonly region: string,
        readonly relationship: Relationship,
    ) {}

    public isValid(
        game: GameDefinition,
        state: IGameState,
        boardState: IBoard,
        boardDef: BoardDefinition,
        cell: string,
        piece: IPiece,
    ) {
        const regionPlayers = this.relationship === Relationship.None
            ? []
            : game.rules.getPlayersByRelationship(piece.owner, this.relationship);

        if (boardDef.isCellInRegion(cell, this.region, regionPlayers)) {
            return true;
        }

        return false;
    }

    public isActionValid() {
        return true;
    }
}