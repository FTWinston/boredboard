import { IBoard } from './IBoard';
import { Dictionary } from '../../data/Dictionary';

export interface IGameState {
    boards: Dictionary<string, IBoard>;
    currentTurn: number;
}
