import { IBoard } from './IBoard';

export interface IGameState {
    boards: Record<string, IBoard>;
}
