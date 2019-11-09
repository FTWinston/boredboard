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

import boardImage from './board.svg';
import blackPawn from './pieces/default/black/pawn.svg';
import whitePawn from './pieces/default/white/pawn.svg';
import blackRook from './pieces/default/black/rook.svg';
import whiteRook from './pieces/default/white/rook.svg';
import blackKnight from './pieces/default/black/knight.svg';
import whiteKnight from './pieces/default/white/knight.svg';
import blackBishop from './pieces/default/black/bishop.svg';
import whiteBishop from './pieces/default/white/bishop.svg';
import blackQueen from './pieces/default/black/queen.svg';
import whiteQueen from './pieces/default/white/queen.svg';
import blackKing from './pieces/default/black/king.svg';
import whiteKing from './pieces/default/white/king.svg';

export default {
    rules,
    boards: {
        'board': {
            ...board as IBoardDefinition,
            imageUrl: boardImage, // ensure correct webpack path is used
        },
    },
    pieces: {
        'pawn': {
            ...pawn as IPieceDefinition,
            imageUrls: { // ensure correct webpack path is used
                1: whitePawn,
                2: blackPawn,
            }
        },
        'rook': {
            ...rook as IPieceDefinition,
            imageUrls: { // ensure correct webpack path is used
                1: whiteRook,
                2: blackRook,
            }
        },
        'knight': {
            ...knight as IPieceDefinition,
            imageUrls: { // ensure correct webpack path is used
                1: whiteKnight,
                2: blackKnight,
            }
        },
        'bishop': {
            ...bishop as IPieceDefinition,
            imageUrls: { // ensure correct webpack path is used
                1: whiteBishop,
                2: blackBishop,
            }
        },
        'queen': {
            ...queen as IPieceDefinition,
            imageUrls: { // ensure correct webpack path is used
                1: whiteQueen,
                2: blackQueen,
            }
        },
        'king': {
            ...king as IPieceDefinition,
            imageUrls: { // ensure correct webpack path is used
                1: whiteKing,
                2: blackKing,
            }
        }
    },
} as IGameDefinition;