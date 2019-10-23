import { Dictionary } from './Dictionary';

export interface IBoardDefinition {
    imageUrl: string;
    links: Dictionary<string, Dictionary<string, string[]>>; // from cell, link type, to cells
    relativeLinks: Dictionary<string, Dictionary<string, string[]>>; // relative link type, from link type, to link types
    playerLinks: Dictionary<string, Dictionary<number, string[]>>; // player link type, player, link types
    linkGroups: Dictionary<string, string[]>; // group name, link types (underlying, relative, or player)
    regions: Dictionary<string, Dictionary<string, Dictionary<number, string[]>>>; // region name, owner player, cells
}