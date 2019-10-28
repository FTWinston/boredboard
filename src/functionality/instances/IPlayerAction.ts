export interface ITracePath {
    toCell: string;
    intermediateCells: string[];
}

export interface IPieceMovement {
    piece: number;
    fromBoard: string;
    toBoard: string;
    fromCell: string;
    toCell: string;
    intermediateCells: string[];
}

export interface IPlayerAction {
    actingPlayer: number;
    actingPiece?: number;
    targetBoard?: string;
    targetCell?: string;
    targetPiece?: number;
    pieceMovement: IPieceMovement[];
}