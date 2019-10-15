import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import './DirectionSetup.css';
import { BoardDispatch } from '../BoardEditor';
import { UniqueList } from '../components/UniqueList';
import { IRelation } from '../boardReducer';
import { SelectorMulti } from '../components/SelectorMulti';

interface Props {
    linkTypes: string[];
    relationTypes: string[];
    relations: IRelation[];
}

export const DirectionSetup: React.FunctionComponent<Props> = props => {
    const context = useContext(BoardDispatch);

    const addRelationType = (val: string) => {
        if (val.length > 0) {
            context({
                type: 'add relation type',
                relationType: val,
            });
        }
    };
    
    const editRelationType = (oldName: string, newName: string) => {
        if (newName === '') {
            context({
                type: 'remove relation type',
                relationType: oldName,
            });
        }
        else {
            context({
                type: 'rename relation type',
                oldName,
                newName,
            });
        }
    }

    const relationDisplays = props.linkTypes.map(fromType => {
        const perRelationType = props.relationTypes.map(relationType => {
            const toTypes = props.relations
                .filter(rel => rel.fromType === fromType && rel.relation === relationType)
                .map(rel => rel.toType);

            const changeValue = (toType: string, selected: boolean) => context({
                type: selected ? 'add relation' : 'remove relation',
                fromType,
                toType,
                relationType,
            });

            return (
                <SelectorMulti
                    prefixText={`These are ${relationType}:`}
                    options={props.linkTypes.filter(t => t !== fromType)}
                    selectedValues={toTypes}
                    changeValue={changeValue}
                />
            );
        });

        return (
            <div key={fromType}>
                <div className="boardEditor__listTitle">From <em>{fromType}</em>:</div>
                {perRelationType}
            </div>
        );
    });

    return (
        <div className="boardEditor directionSetup">
            <div className="boardEditor__board directionSetup__directions">
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
                    addValue={addRelationType}
                    changeValue={editRelationType}
                    values={props.relationTypes.length === 1 && props.relationTypes[0] === '' ? [] : props.relationTypes}
                />
            </div>

            <div className="boardEditor__content">
                {relationDisplays}
            </div>

            <div className="boardEditor__navigation">
                <Link to="/manuallinks">Back</Link>
                <Link to="/directiongroups">Continue</Link>
            </div>
        </div>
    );
}