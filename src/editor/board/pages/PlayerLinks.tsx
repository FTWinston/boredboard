import React, { useContext, useMemo } from 'react';
import { Link } from 'react-router-dom';
import './PlayerLinks.css';
import { BoardDispatch } from '../BoardEditor';
import { UniqueList } from '../components/UniqueList';

interface Props {
    linkTypes: string[];
    relativeLinkTypes: string[];
    playerLinkTypes: string[];
    numPlayers: number;
    prevPage: string;
    nextPage: string;
}

export const PlayerLinks: React.FunctionComponent<Props> = props => {
    const context = useContext(BoardDispatch);
    
    const addPlayerLinkType = (val: string) => {
        if (val.length > 0) {
            context({
                type: 'add player link type',
                playerLinkType: val,
            });
        }
    };
    
    const editPlayerLinkType = (oldName: string, newName: string) => {
        if (newName === '') {
            context({
                type: 'remove player link type',
                playerLinkType: oldName,
            });
        }
        else {
            context({
                type: 'rename player link type',
                oldName,
                newName,
            });
        }
    }

    const disallowedTypes = useMemo(() => [
        ...props.linkTypes,
        ...props.relativeLinkTypes,
    ], [props.linkTypes, props.relativeLinkTypes]);

    // TODO: Specify what link type each player link type represents for each player ... can be "none"
    const playerLinkDisplays = props.relativeLinkTypes.length === 0
        ? 'You currently have no player direction types'
        : <div />

    return (
        <div className="boardEditor playerLinks">
            <div className="boardEditor__board playerLinks__lookup">
                <p>
                    If each player "faces" a different direction, and their pieces move according to that, you can define these player-specific directions here.
                </p>
                <p>
                    For example chess pawns move <em>forward</em>, which is different for each player.
                </p>

                <div className="boardEditor__listTitle">Player direction types</div>
                
                <UniqueList
                    addValue={addPlayerLinkType}
                    changeValue={editPlayerLinkType}
                    values={props.playerLinkTypes}
                    disallowedValues={disallowedTypes}
                />
            </div>

            <div className="boardEditor__content">
                {playerLinkDisplays}
            </div>

            <div className="boardEditor__navigation">
                <Link to={props.prevPage}>Back</Link>
                <Link to={props.nextPage}>Continue</Link>
            </div>
        </div>
    );
}