import { GameDefinition } from '../GameDefinition';
import { BoardDefinition } from '../BoardDefinition';
import { IBoard } from '../../instances/IBoard';
import { IGameState } from '../../instances/IGameState';
import { IPieceMovement } from '../../instances/IPlayerAction';
import { IPiece } from '../../instances/IPiece';

export interface IMoveCondition {
    isValid(
        move: IPieceMovement,
        game: GameDefinition,
        state: IGameState,
        boardState: IBoard,
        boardDef: BoardDefinition,
        piece: IPiece,
    ): boolean;
}