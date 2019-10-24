import { IGameDefinition } from '../../data/IGameDefinition';
import { IPieceDefinition } from '../../data/IPieceDefinition.js';
import { IBoardDefinition } from '../../data/IBoardDefinition.js';
import board from './board.json';
import pawn from './pieces/pawn.json';
import rook from './pieces/rook.json';
import knight from './pieces/knight.json';
import bishop from './pieces/bishop.json';
import queen from './pieces/queen.json';
import king from './pieces/king.json';
import { rules } from './rules';

export default {
    rules,
    boards: {
        'board': board as IBoardDefinition,
    },
    pieces: {
        'pawn': pawn as IPieceDefinition,
        'rook': rook as IPieceDefinition,
        'knight': knight as IPieceDefinition,
        'bishop': bishop as IPieceDefinition,
        'queen': queen as IPieceDefinition,
        'king': king as IPieceDefinition,
    },
} as IGameDefinition;