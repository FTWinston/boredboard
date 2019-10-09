export interface IBoard {
    imageUrl: string;
    links: Record<string, Record<string, string[]>>; // from cell, link type, to cells
    regions: Record<string, Record<string, string[]>>; // name, owner player, cells
}