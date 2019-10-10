import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import './LinkTypes.css';
import { BoardDisplay } from '../../../components/board';
import { BoardDispatch } from '../BoardEditor';
import { LabelStyle } from '../../../data/LabelSize';
import { UniqueTextBox } from '../../../components/UniqueTextBox';

interface Props {
    boardUrl: string;
    linkTypes: string[];
    cells: string[];
}

export const LinkTypes: React.FunctionComponent<Props> = props => {
    const context = useContext(BoardDispatch);
    
    const continueLink = props.linkTypes.length === 0
        ? <div title="Cannot continue until at least one link type is defined">Continue</div>
        : <Link to="/links">Continue</Link>

    const existingTypes = props.linkTypes.map((type, i) => {
        const editType = (val: string) => {
            const linkTypes = props.linkTypes.slice();

            if (val === '') {
                linkTypes.splice(i, 1);
            }
            else {
                linkTypes[i] = val;
            }

            context({
                type: 'set link types',
                linkTypes,
            })
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
        const linkTypes = props.linkTypes.slice();
        linkTypes.push(val);

        context({
            type: 'set link types',
            linkTypes,
        })
    };

    return (
        <div className="boardEditor linkTypes">
            <BoardDisplay
                className="boardEditor__board"
                filePath={props.boardUrl}
                labelCells={props.cells}
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
                </p>
                <p>
                    If pieces in your game follow different paths (e.g. up ladders and down snakes), then you'll need a different link type for each type of path.
                </p>
                <p>
                    If directions don't matter to piece movement, or if they only have a single path they can move on, you might only need one link type.
                </p>

                <div className="linkTypes__links">
                    {existingTypes}
                    <UniqueTextBox
                        key={props.linkTypes.length}
                        disallowedValues={props.linkTypes}
                        initialValue=""
                        finishedEditing={addType}
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