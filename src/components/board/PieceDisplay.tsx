import React, { useMemo } from 'react';
import { SvgLoader } from 'react-svgmt';
import { GameDefinition } from '../../functionality/definitions/GameDefinition';

interface Props {
    className?: string;
    game: GameDefinition;
    definition: string;
    owner: number;
    onClick?: () => void;
}

export const PieceDisplay: React.FunctionComponent<Props> = props => {
    const imageUrl = useMemo(() => {
            const definition = props.game.pieces.get(props.definition);
            if (definition === undefined) {
                console.log(`Cannot find piece definition: ${props.definition}`);
                return undefined;
            }
            
            const imageUrl = definition.imageUrls.get(props.owner);
            if (imageUrl === undefined) {
                console.log(`Piece has no image for player ${props.owner}`, definition.imageUrls);
                return undefined;
            }

            return imageUrl;
        },
        [props.game, props.definition, props.owner]
    );

    if (imageUrl) {
        const className = props.className === undefined
            ? 'piece'
            : `${props.className} piece`;

        return <SvgLoader
            path={imageUrl}
            className={className}
            onClick={props.onClick}
        />
    }
    else {
        const className = props.className === undefined
            ? 'piece piece--error'
            : `${props.className} piece piece--error`;

        return <div className={className} onClick={props.onClick}>{props.definition} error</div>;
    }
}