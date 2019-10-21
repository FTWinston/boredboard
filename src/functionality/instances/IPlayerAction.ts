export interface IPieceMovement {
    piece: number;
    fromBoard: string;
    toBoard: string;
    fromCell: string;
    toCell: string;
}

export interface IPlayerAction {
    pieceMovement: IPieceMovement[];
}