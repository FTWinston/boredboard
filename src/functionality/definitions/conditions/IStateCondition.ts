import { GameDefinition } from '../GameDefinition';
import { IBoard } from '../../instances/IBoard';
import { IGameState } from '../../instances/IGameState';
import { IPiece } from '../../instances/IPiece';
import { BoardDefinition } from '../BoardDefinition';

export interface IStateCondition {
    isValid(
        game: GameDefinition,
        state: IGameState,
        boardState: IBoard,
        boardDef: BoardDefinition,
        cell: string,
        piece: IPiece,
    ): boolean;
}