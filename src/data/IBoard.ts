export interface IBoard {
    imageUrl: string;
    links: Record<string, Record<string, string[]>>; // from cell, link type, to cells
    relativeLinks: Record<string, Record<string, string[]>>; // relative link type, from link type, to link types
    playerLinks: Record<string, Record<number, string[]>>; // player link type, player, link types
    linkGroups: Record<string, string[]>; // group name, link types (underlying, relative, or player)
    regions: Record<string, Record<number, string[]>>; // region name, owner player, cells
}