import { Dictionary } from './Dictionary';

export interface IPieceDefinition {
    imageUrls: Dictionary<number, string>; // player, image url
    behaviour: string; // each piece type's behaviour is defined through natural-configuration
    value: number;
}