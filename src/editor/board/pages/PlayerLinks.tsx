import React, { useContext, useMemo } from 'react';
import { Link } from 'react-router-dom';
import './PlayerLinks.css';
import { BoardDispatch } from '../BoardEditor';
import { UniqueList } from '../components/UniqueList';
import { IPlayerLink } from '../boardReducer';
import { SelectorSingle } from '../components/SelectorSingle';

interface Props {
    linkTypes: string[];
    relativeLinkTypes: string[];
    playerLinkTypes: string[];
    playerLinks: IPlayerLink[];
    numPlayers: number;
    prevPage: string;
    nextPage: string;
}

const notAvailable = 'not used';

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

    const playerDirectionOptions = useMemo(() => [
        notAvailable,
        ...props.linkTypes,
    ], [props.linkTypes])

    const playerIDs = useMemo(
        () => {
            const IDs: number[] = [];
            for (let i=1; i<=props.numPlayers; i++) {
                IDs.push(i);
            }
            return IDs;
        },
        [props.numPlayers]
    );

    // Specify what link type each player link type represents for each player ... can be "none"
    const playerLinkDisplays = props.playerLinkTypes.length === 0
        ? 'You currently have no player direction types'
        : playerIDs.map(player => {
            const perPlayer = props.playerLinkTypes.map(playerLinkType => {
                const existingLink = props.playerLinks
                    .find(l => l.player === player && l.playerLinkType === playerLinkType);

                const selectValue = (linkType: string) => linkType === notAvailable
                    ? context({
                        type: 'remove player link',
                        player,
                        playerLinkType,
                    })
                    : context({
                        type: 'set player link',
                        player,
                        playerLinkType,
                        linkType,
                    });

                return (
                    <SelectorSingle
                        key={playerLinkType}
                        prefixText={`${playerLinkType} is:`}
                        radioGroup={`playerLink-${playerLinkType}-${player}`}
                        options={playerDirectionOptions}
                        selectedValue={existingLink === undefined ? notAvailable : existingLink.linkType}
                        selectValue={selectValue}
                    />
                );
            });

            return (
                <div key={player}>
                    <div className="boardEditor__listTitle">For player #{player}:</div>
                    {perPlayer}
                </div>
            )
        });

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