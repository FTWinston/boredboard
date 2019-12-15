import React, { useContext, useMemo } from 'react';
import './RelativeLinks.css';
import { BoardDispatch } from '../BoardEditor';
import { UniqueList } from '../components/UniqueList';
import { IRelativeLink } from '../boardReducer';
import { SelectorMulti } from '../components/SelectorMulti';
import { disallowedNames } from '../../../data/reservedWords';
import { NavLinks } from '../components/NavLinks';

interface Props {
    linkTypes: string[];
    relativeLinkTypes: string[];
    relativeLinks: IRelativeLink[];
    playerLinkTypes: string[];
    prevPage?: string;
    nextPage?: string;
    summaryPage?: string;
}

export const RelativeLinks: React.FunctionComponent<Props> = props => {
    const context = useContext(BoardDispatch);

    const addRelativeLinkType = (val: string) => {
        if (val.length > 0) {
            context({
                type: 'add relative link type',
                relativeLinkType: val,
            });
        }
    };
    
    const editRelativeLinkType = (oldName: string, newName: string) => {
        if (newName === '') {
            context({
                type: 'remove relative link type',
                relativeLinkType: oldName,
            });
        }
        else {
            context({
                type: 'rename relative link type',
                oldName,
                newName,
            });
        }
    }

    const disallowedTypes = useMemo(() => [
        ...props.linkTypes,
        ...props.playerLinkTypes,
        ...disallowedNames,
    ], [props.linkTypes, props.playerLinkTypes]);

    const relativeLinkDisplays = props.relativeLinkTypes.length === 0
        ? 'You currently have no relative direction types'
        : props.linkTypes.map(fromType => {
            const perRelativeLinkType = props.relativeLinkTypes.map(relativeLinkType => {
                const toTypes = props.relativeLinks
                    .filter(rel => rel.fromType === fromType && rel.relativeLinkType === relativeLinkType)
                    .map(rel => rel.toType);

                const changeValue = (toType: string, selected: boolean) => context({
                    type: selected ? 'add relative link' : 'remove relative link',
                    fromType,
                    toType,
                    relativeLinkType,
                });

                return (
                    <SelectorMulti
                        key={relativeLinkType}
                        prefixText={`${relativeLinkType} is:`}
                        options={props.linkTypes.filter(t => t !== fromType)}
                        selectedValues={new Set<string>(toTypes)}
                        changeValue={changeValue}
                    />
                );
            });

            return (
                <div key={fromType}>
                    <div className="boardEditor__listTitle">From <em>{fromType}</em>:</div>
                    {perRelativeLinkType}
                </div>
            );
        });

    return (
        <div className="boardEditor relativeLinks">
            <div className="boardEditor__board relativeLinks__lookup">
                <p>
                    If your link types represent directions, then you can optionally specify how those directions
                    relate to each other.
                </p>
                <p>
                    For example in chess, a knight moves two squares in one direction then
                    one square in a <em>perpendicular</em> direction (i.e. at 90 degrees to the original direction).
                    The concept of directions relating to each other lets us describe this without listing
                    several different options.
                </p>

                <div className="boardEditor__listTitle">Relative direction types</div>
                
                <UniqueList
                    addValue={addRelativeLinkType}
                    changeValue={editRelativeLinkType}
                    values={props.relativeLinkTypes.length === 1 && props.relativeLinkTypes[0] === '' ? [] : props.relativeLinkTypes}
                    disallowedValues={disallowedTypes}
                />
            </div>

            <div className="boardEditor__content">
                {relativeLinkDisplays}
            </div>

            <NavLinks
                prevPage={props.prevPage}
                nextPage={props.nextPage}
                summaryPage={props.summaryPage}
            />
        </div>
    );
}