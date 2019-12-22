import { IBoardDefinition } from './IBoardDefinition';
import { IPieceDefinition } from './IPieceDefinition';
import { Dictionary } from './Dictionary';
import { IGameState } from '../functionality/instances/IGameState';

export interface IGameDefinition {
    rules: string;
    boards: Dictionary<string, IBoardDefinition>;
    pieces: Dictionary<string, IPieceDefinition>;
    initialState: IGameState;
}