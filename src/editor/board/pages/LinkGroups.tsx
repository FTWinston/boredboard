import React, { useContext, useMemo } from 'react';
import { Link } from 'react-router-dom';
import './LinkGroups.css';
import { BoardDispatch } from '../BoardEditor';
import { IGroupItem } from '../boardReducer';
import { UniqueList } from '../components/UniqueList';
import { SelectorMulti } from '../components/SelectorMulti';

interface Props {
    linkTypes: string[];
    relativeLinkTypes: string[];
    playerLinkTypes: string[];
    linkGroupTypes: string[];
    linkGroupItems: IGroupItem[];
    prevPage: string;
    nextPage: string;
}

export const LinkGroups: React.FunctionComponent<Props> = props => {
    const context = useContext(BoardDispatch);
    
    const addGroupType = (val: string) => {
        if (val.length > 0) {
            context({
                type: 'add link group',
                groupType: val,
            });
        }
    };
    
    const editGroupType = (oldName: string, newName: string) => {
        if (newName === '') {
            context({
                type: 'remove link group',
                groupType: oldName,
            });
        }
        else {
            context({
                type: 'rename link group',
                oldName,
                newName,
            });
        }
    }

    const options = useMemo(() => [
        ...props.linkTypes,
        ...props.relativeLinkTypes,
        ...props.playerLinkTypes,
    ], [props.linkTypes, props.relativeLinkTypes, props.playerLinkTypes]);

    const groupItemDisplays = props.relativeLinkTypes.length === 0
        ? 'You currently have no link groups'
        : props.linkGroupTypes.map(groupType => {
            const groupItems = props.linkGroupItems
                .filter(i => i.groupType === groupType)
                .map(i => i.itemName);

            const changeValue = (itemName: string, selected: boolean) => context({
                type: selected ? 'add link group item' : 'remove link group item',
                groupType,
                itemName,
            });

            return (
                <SelectorMulti
                    key={groupType}
                    prefixText={`These are ${groupType}:`}
                    options={options}
                    selectedValues={groupItems}
                    changeValue={changeValue}
                />
            );
        });

    return (
        <div className="boardEditor linkGroups">
            <div className="boardEditor__board linkGroups__lookup">
                <p>
                    If your link types represent directions, these can be grouped to make definining piece movement easier.
                </p>

                <p>
                    For example in chess, grouping the four diagonal directions together lets bishops be defined as moving <em>diagonally</em>,
                    instead of having to mention moving northeast, northwest, southeast and southwest separately.
                </p>

                <div className="boardEditor__listTitle">Direction groups</div>
                
                <UniqueList
                    addValue={addGroupType}
                    changeValue={editGroupType}
                    values={props.linkGroupTypes}
                    disallowedValues={options}
                />
            </div>

            <div className="boardEditor__content">
                {groupItemDisplays}
            </div>

            <div className="boardEditor__navigation">
                <Link to={props.prevPage}>Back</Link>
                <Link to={props.nextPage}>Continue</Link>
            </div>
        </div>
    );
}