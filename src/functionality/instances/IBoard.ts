import { IPiece } from './IPiece';
import { Dictionary } from '../../data/Dictionary';

export interface IBoard {
    definition: string;
    cellContents: Dictionary<string, Dictionary<string, IPiece>>;
}