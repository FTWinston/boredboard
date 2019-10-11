import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import './LinkTypes.css';
import { BoardDisplay } from '../../../components/board';
import { BoardDispatch } from '../BoardEditor';
import { LabelStyle } from '../../../data/LabelSize';
import { UniqueTextBox } from '../components/UniqueTextBox';

interface Props {
    boardUrl: string;
    linkTypes: string[];
    cells: string[];
}

export const LinkTypes: React.FunctionComponent<Props> = props => {
    const context = useContext(BoardDispatch);
    
    const continueLink = props.linkTypes.length === 0
        ? <div title="Cannot continue until at least one link type is defined">Continue</div>
        : <Link to="/bulklinks">Continue</Link>

    const existingTypes = props.linkTypes.map((type, i) => {
        const editType = (val: string) => {
            if (val === '') {
                context({
                    type: 'remove link type',
                    linkType: type,
                });
            }

            context({
                type: 'rename link type',
                oldName: type,
                newName: val,
            });
        };

        return (
            <UniqueTextBox
                key={type}
                disallowedValues={props.linkTypes}
                allowIndex={i}
                initialValue={type}
                finishedEditing={editType}
            />
        );
    });

    const addType = (val: string) => {
        if (val.length > 0) {
            context({
                type: 'add link type',
                linkType: val,
            });
        }
    };

    return (
        <div className="boardEditor linkTypes">
            <BoardDisplay
                className="boardEditor__board"
                filePath={props.boardUrl}
                cells={props.cells}
                labelStyle={LabelStyle.FillCell}
            />
            
            <div className="boardEditor__content">
                <p>
                    Please specify all of the link types that can exist between cells.
                </p>
                <p>
                    In some games, there might be only one link type, convering movement in all directions,
                    whereas other games will have a different link type for each direction.
                </p>
                <p>
                    If pieces in your game care about what directions they move in (e.g. chess pawns move forward, not backwards or sideways),
                    then you'll need a different link type for each direction.
                    <br/>These should be absolute directions (e.g. north, south, east, west).
                    <br/>If different players have different concepts of "forward" (such as in chess), this will be handled at a later step.
                </p>
                <p>
                    If pieces in your game follow different paths (e.g. up ladders and down snakes), then you'll need a different link type for each type of path.
                </p>
                <p>
                    If directions don't matter to piece movement, or if they only have a single path they can move on, you might only need one link type.
                </p>

                <div className="boardEditor__listTitle">Link types</div>
                <div className="linkTypes__links">

                    {existingTypes}
                    <UniqueTextBox
                        key={props.linkTypes.length}
                        disallowedValues={props.linkTypes}
                        initialValue=""
                        finishedEditing={addType}
                    />
                    <UniqueTextBox
                        className="linkTypes__nextLink"
                        key={props.linkTypes.length+1}
                        disallowedValues={props.linkTypes}
                        initialValue=""
                        finishedEditing={() => {}}
                    />
                </div>
            </div>

            <div className="boardEditor__navigation">
                <Link to="/cells">Back</Link>
                {continueLink}
            </div>
        </div>
    );
}