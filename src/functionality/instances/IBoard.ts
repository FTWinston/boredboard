import { IPiece } from './IPiece';

export interface IBoard {
    definition: string;
    cellContents: Record<string, IPiece[]>;
}