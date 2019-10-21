import { GameDefinition } from '../definitions/GameDefinition';
import { IGameState } from './IGameState';
import { IPlayerAction, IPieceMovement } from './IPlayerAction';

export class Game {
    constructor(public readonly definition: GameDefinition, public state: IGameState) {
        
    }

    public applyAction(action: IPlayerAction, state: IGameState) {
        for (const move of action.pieceMovement) {
            if (!this.applyMovement(move, state)) {
                return false;
            }
        }

        return true;
    }

    private applyMovement(move: IPieceMovement, state: IGameState) {
        const { piece, fromBoard, fromCell, toBoard, toCell } = move;

        const fromBoardInstance = state.boards[fromBoard];
        if (fromBoardInstance === undefined) {
            return false;
        }

        const fromCellContent = fromBoardInstance.cellContents[fromCell];
        if (fromCellContent === undefined) {
            return false;
        }

        const toBoardInstance = state.boards[toBoard];
        if (fromBoardInstance === undefined) {
            return false;
        }

        const toCellContent = toBoardInstance.cellContents[toCell];
        if (toCellContent === undefined) {
            return false;
        }

        const pieceIndex = fromCellContent.findIndex(p => p.id === piece);
        if (pieceIndex === undefined) {
            return false;
        }

        const [pieceInstance] = fromCellContent.splice(pieceIndex, 1);

        toCellContent.push(pieceInstance);

        return true;
    }
}