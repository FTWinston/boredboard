export interface IBoard {
    imageUrl: string;
    links: Record<string, Record<string, string[]>>; // from cell, link type, to cells
    relativeLinks: Record<string, Record<string, string[]>>; // from link type, relative link type, to link types
    playerLinks: Record<number, Record<string, string>>; // player, player link type, link type
    linkGroups: Record<string, Record<number, string[]>>; // name, player, link types (underlying, relative, or player)
    regions: Record<string, Record<number, string[]>>; // name, owner player, cells
}