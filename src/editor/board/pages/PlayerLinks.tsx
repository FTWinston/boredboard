import React, { useContext, useMemo } from 'react';
import './PlayerLinks.css';
import { BoardDispatch } from '../BoardEditor';
import { UniqueList } from '../components/UniqueList';
import { IPlayerLink } from '../boardReducer';
import { SelectorMulti } from '../components/SelectorMulti';
import { disallowedNames } from '../../../data/reservedWords';
import { NavLinks } from '../components/NavLinks';

interface Props {
    linkTypes: string[];
    relativeLinkTypes: string[];
    playerLinkTypes: string[];
    playerLinks: IPlayerLink[];
    numPlayers: number;
    prevPage?: string;
    nextPage?: string;
    summaryPage?: string;
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
        ...disallowedNames,
    ], [props.linkTypes, props.relativeLinkTypes]);

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
                const existingLinks = props.playerLinks
                    .filter(l => l.player === player && l.playerLinkType === playerLinkType)
                    .map(l => l.linkType);

                const changeValue = (linkType: string, selected: boolean) => context({
                    type: selected ? 'add player link' : 'remove player link',
                    player,
                    playerLinkType,
                    linkType,
                });

                return (
                    <SelectorMulti
                        key={playerLinkType}
                        prefixText={`${playerLinkType} is:`}
                        options={props.linkTypes}
                        selectedValues={new Set<string>(existingLinks)}
                        changeValue={changeValue}
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
                    For example, chess pawns move <em>forward</em> and attack <em>diagonally forward</em>. These are different for each player.
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

            <NavLinks
                prevPage={props.prevPage}
                nextPage={props.nextPage}
                summaryPage={props.summaryPage}
            />
        </div>
    );
}