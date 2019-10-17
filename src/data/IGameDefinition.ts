import { IBoardDefinition } from './IBoardDefinition';
import { IPieceDefinition } from './IPieceDefinition';

export interface IGameDefinition {
    boards: Record<string, IBoardDefinition>;
    pieces: Record<string, IPieceDefinition>;
}