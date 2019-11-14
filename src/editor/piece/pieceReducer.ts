import { readStateFromPiece } from './readStateFromPiece';
import { IPieceDefinition } from '../../data/IPieceDefinition';

export interface IPlayerImage {
    player: number;
    imageUrl: string;
}

export interface IState {
    images: IPlayerImage[];
    behaviour: string;
    value: number;
}

export type PieceAction = {
    type: 'set player image';
    player: number;
    url: string;
} | {
    type: 'set sole image';
    url: string;
} | {
    type: 'set behaviour';
    behaviour: string;
}

export function getInitialState(piece?: IPieceDefinition): IState {
    if (piece !== undefined) {
        return readStateFromPiece(piece);
    }

    return {
        images: [],
        behaviour: '',
        value: 1,
    };
}

export function reducer(state: IState, action: PieceAction): IState {
    switch (action.type) {
        case 'set player image':
            return {
                ...state,
                images: [
                    ...state.images.filter(i => i.player !== action.player && i.player !== 0),
                    {
                        player: action.player,
                        imageUrl: action.url,
                    },
                ]
            }
            
        case 'set sole image':
            return {
                ...state,
                images: [
                    {
                        player: 0,
                        imageUrl: action.url,
                    }
                ]
            }

        case 'set behaviour':
            return {
                ...state,
                behaviour: action.behaviour
            };
    }
}