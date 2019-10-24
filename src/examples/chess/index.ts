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

export default {
    rules: `Players take alternate turns, starting with player 1. Multiple pieces cannot occupy the same cell. A piece cannot move through a cell that is not empty. If a piece moves into the same cell as an enemy piece, it captures it. Disallow any move that threatens a friendly king. If a player cannot move and their king is threatened, end the game with their loss. If a player cannot move and their king is not threatened, end the game with a draw. If a king is threatened at the start of a turn, say "Check".`,
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