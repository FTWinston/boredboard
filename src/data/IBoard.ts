export interface IBoard {
    imageUrl: string;
    links: Record<string, Record<string, string[]>>; // from cell, link type, to cells
    relations: Record<string, Record<string, string[]>>; // from link type, relation type, to link types
    regions: Record<string, Record<number, string[]>>; // name, owner player, cells
}