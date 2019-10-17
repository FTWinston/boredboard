export interface IPieceDefinition {
    imageUrls: Record<number, string>; // player, image url
    behaviour: string; // each piece type's behaviour is defined through natural-configuration
    value: number;
}