import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import './DirectionSetup.css';
import { BoardDispatch } from '../BoardEditor';
import { UniqueList } from '../components/UniqueList';
import { IRelation } from '../boardReducer';
import { RelationEdit } from '../components/RelationEdit';

interface Props {
    linkTypes: string[];
    relationTypes: string[];
    relations: IRelation[];
}

export const DirectionSetup: React.FunctionComponent<Props> = props => {
    const context = useContext(BoardDispatch);
    
    const changeDirection = (oldName: string, newName: string) => {
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

    const addDirection = (val: string) => {
        if (val.length > 0) {
            context({
                type: 'add relation type',
                relationType: val,
            });
        }
    };

    return (
        <div className="boardEditor directionSetup">
            <div className="boardEditor__board">
                <p>
                    If your link types represent directions then you can optionally specify how those directions
                    relate to each other. For example, in chess a knight moves two squares in one direction then
                    one square in an <em>orthogonal</em> direction (i.e. at 90 degrees to the original direction).
                    The concept of directions relating to each other lets us describe this without listing
                    several different options.
                </p>

                <div className="boardEditor__listTitle">Relative directions</div>
                
                <UniqueList
                    addValue={addDirection}
                    changeValue={changeDirection}
                    values={props.relationTypes.length === 1 && props.relationTypes[0] === '' ? [] : props.relationTypes}
                />
            </div>

            <div className="boardEditor__content">
                {props.relations.map((r, i) => (
                    <RelationEdit
                        fromLinkType={r.fromType}
                        toLinkType={r.toType}
                        relationType={r.relation}
                        linkTypes={props.linkTypes}
                        relationTypes={props.relationTypes}
                        edit={(from, to, type) => { /* TODO */ }}
                    />
                ))}
            </div>

            <div className="boardEditor__navigation">
                <Link to="/manuallinks">Back</Link>
                <Link to="/directiongroups">Continue</Link>
            </div>
        </div>
    );
}