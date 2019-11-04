export interface IPiece {
    definition: string;
    owner: number;
    firstMove?: number;
    lastMove?: number;
    lastThreatened?: number;
}