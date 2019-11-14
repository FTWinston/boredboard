import { IPieceDefinition } from '../../data/IPieceDefinition';
import { IState } from './pieceReducer';
import { Dictionary } from '../../data/Dictionary';

export function writePieceFromState(state: IState, numPlayers: number): IPieceDefinition {
    const images: Dictionary<number, string> = {};

    for (const image of state.images) {
        images[image.player] = image.imageUrl;
    }

    return {
        imageUrls: images,
        behaviour: state.behaviour,
        value: 1,
    };
}