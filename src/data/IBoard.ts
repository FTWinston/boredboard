export interface IBoard {
    imageUrl: string;
    links: Record<string, Record<string, string[]>>; // from cell, link type, to cells
    relativeLinks: Record<string, Record<string, string[]>>; // from link type, relative link type, to link types
    playerLinks: Record<number, Record<string, string>>; // player, player link type, link type
    regions: Record<string, Record<number, string[]>>; // name, owner player, cells
}