export interface ITracePath {
    toCell: string;
    intermediateCells: string[];
}

export interface IPieceMovement {
    piece: string;
    fromBoard: string;
    toBoard: string;
    fromCell: string;
    toCell: string;
    intermediateCells: string[];
}

export interface IPlayerAction {
    actingPlayer: number;
    fromCell?: string;
    actingPiece?: string;
    targetBoard?: string;
    targetCell?: string;
    targetPiece?: string;
    pieceMovement: IPieceMovement[];
}