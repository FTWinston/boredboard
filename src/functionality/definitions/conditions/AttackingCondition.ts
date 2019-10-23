import { IMoveCondition } from './IMoveCondition';
import { IGameState } from '../../instances/IGameState';
import { GameDefinition } from '../GameDefinition';
import { IPlayerAction, IPieceMovement } from '../../instances/IPlayerAction';
import { IBoard } from '../../instances/IBoard';
import { BoardDefinition } from '../BoardDefinition';
import { IPiece } from '../../instances/IPiece';

export class AttackingCondition implements IMoveCondition {
    constructor(readonly isAttacking: boolean) {}

    public isValid(
        move: IPieceMovement,
        game: GameDefinition,
        state: IGameState,
        boardState: IBoard,
        boardDef: BoardDefinition,
        piece: IPiece,
    ) {
        // TODO: do the game rules trigger "captured" pieces being moved to player hands?
        // If so, we should just check for that in action.pieceMovement ... more thought needed.
        const toBoard = state.boards[move.toBoard];

        if (toBoard === undefined) {
            return false;
        }

        const toCellContents = toBoard.cellContents[move.toCell];

        // TODO: if a piece owned by an enemy is in this cell, this is valid?
        const attacking = true;

        return attacking === this.isAttacking;
    }
}