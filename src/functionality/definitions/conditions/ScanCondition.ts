import { IStateCondition } from './IStateCondition';
import { IGameState } from '../../instances/IGameState';
import { GameDefinition } from '../GameDefinition';
import { IPiece } from '../../instances/IPiece';
import { BoardDefinition } from '../BoardDefinition';
import { IBoard } from '../../instances/IBoard';
import { CellMoveability } from '../CellMoveability';
import { CellFilter } from '../PieceActionDefinition';

export class ScanCondition implements IStateCondition {
    constructor(
        readonly cellFilter: CellFilter,
        readonly direction: string,
        readonly minDistance: number,
        readonly maxDistance?: number,
    ) {}

    public isValid(
        game: GameDefinition,
        state: IGameState,
        boardState: IBoard,
        boardDef: BoardDefinition,
        cell: string,
        piece: IPiece,
    ) {
        const linkTypes = boardDef.resolveDirection(this.direction, piece.owner);

        for (const linkType of linkTypes) {
            const testCells = boardDef.traceLink(() => CellMoveability.All, cell, linkType, this.minDistance, this.maxDistance);

            for (const testCell of testCells) {
                if (this.cellFilter(game, state, boardState, boardDef, testCell.toCell, piece.owner)) {
                    // TODO: pass out linkType, somehow, so it can be used
                    // ... damn this could be several, couldn't it.
                    // With slightly different rules you could en passant both ways.
                    return true;
                }
            }
        }

        return false;
    }

    public isActionValid() {
        return true;
    }
}