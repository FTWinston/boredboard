import { IPieceDefinition } from '../../data/IPieceDefinition';
import { IPlayerImage } from './pieceReducer';

export function readStateFromPiece(piece: IPieceDefinition) {
    const images = Object.keys(piece.imageUrls).map(strID => {
        const id = parseInt(strID);

        return {
            player: id,
            imageUrl: piece.imageUrls[id],
        } as IPlayerImage;
    });

    return {
        images: images,
        behaviour: piece.behaviour,
        value: piece.value,
    };
}