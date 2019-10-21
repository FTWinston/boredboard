import { GameDefinition } from './GameDefinition';
import { IBoard } from '../instances/IBoard';
import { IGameState } from '../instances/IGameState';
import { IPlayerAction } from '../instances/IPlayerAction';
import { IPiece } from '../instances/IPiece';

export interface IPieceActionCondition {
    isStateValid(game: GameDefinition, state: IGameState, board: IBoard, cell: string, piece: IPiece): boolean;
    isActionValid(action: IPlayerAction, game: GameDefinition, state: IGameState, board: IBoard, cell: string, piece: IPiece): boolean;
}