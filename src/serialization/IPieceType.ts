export interface IPieceType {
    imageUrls: Record<string, string>; // player, image url
    behaviour: string; // each piece type's behaviour is defined through natural-configuration
}