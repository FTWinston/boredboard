import { Dictionary } from '../../../data/Dictionary';
import { IPiece } from '../IPiece';

export function isEmpty(cell: Dictionary<string, IPiece>) {
    for (const _ in cell) {
        return false;
    }

    return true;
}