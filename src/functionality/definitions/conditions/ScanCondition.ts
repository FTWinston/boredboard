import { IStateCondition } from './IStateCondition';
import { IGameState } from '../../instances/IGameState';
import { GameDefinition } from '../GameDefinition';
import { IPiece } from '../../instances/IPiece';
import { BoardDefinition } from '../BoardDefinition';
import { IBoard } from '../../instances/IBoard';

export class ScanCondition implements IStateCondition {
    constructor(
        readonly matchPiece: (piece: IPiece) => boolean,
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
            const testCells = boardDef.traceLink(boardState, testCell, cell, linkType, this.minDistance, this.maxDistance);

            for (const testCell of testCells) {
                const pieces = boardState.cellContents[testCell];
                if (pieces !== undefined) {
                    for (const piece in pieces) {
                        const pieceData = pieces[piece as unknown as number]!;

                        if (this.matchPiece(pieceData)) {
                            // TODO: pass out linkType, somehow, so it can be used
                            // ... damn this could be several, couldn't it.
                            // With slightly different rules you could en passant both ways.
                            return true;
                        }
                    }
                }
            }
        }

        return false;
    }

    public isActionValid() {
        return true;
    }
}