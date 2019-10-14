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
    
    const existingTypes = props.linkTypes.length === 1 && props.linkTypes[0] === ''
        ? undefined
        : props.linkTypes.map((type, i) => {
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
                    Do different pieces move in different directions? (e.g. chess)<br/>
                    Can pieces move on different paths? (e.g. snakes &amp; ladders)<br/>
                    Might pieces move in different directions at different times? (e.g. usually forward but occasionally backward)
                </p>
                <p>
                    If any of these apply, you need to use different link types for each direction or path.<br/>
                    Please specify them here.
                </p>
                <p>
                    If none of these apply, leave the list blank.<br/>
                    If different players have different concepts of "forward" (such as in chess), this will be handled at a later step.<br/>
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
                <Link
                    to="/bulklinks"
                    onClick={() => { if (props.linkTypes.length === 0) { context({ type: 'set link types', linkTypes: [''] }); } }}
                >
                    Continue
                </Link>
            </div>
        </div>
    );
}