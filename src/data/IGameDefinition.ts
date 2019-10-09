import { IBoard } from './IBoard';
import { IPieceType } from './IPieceType';

export interface IGameDefinition {
    boards: Record<string, IBoard>;
    pieceTypes: Record<string, IPieceType>;
}