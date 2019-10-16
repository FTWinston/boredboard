import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import './LinkGroups.css';
import { BoardDisplay } from '../../../components/board';
import { BoardDispatch } from '../BoardEditor';

interface Props {
    boardUrl: string;
    cells: string[];
    linkTypes: string[];
    relativeLinkTypes: string[];
    prevPage: string;
    nextPage: string;
}

export const LinkGroups: React.FunctionComponent<Props> = props => {
    const context = useContext(BoardDispatch);
    
    return (
        <div className="boardEditor linkGroups">
            <BoardDisplay
                className="boardEditor__board"
                filePath={props.boardUrl}
                cells={props.cells}
            />

            <div className="boardEditor__content">
                Ability to group directions into e.g. "orthogonal", "sideways" etc. These can include link types, relative link types and player link types.
            </div>

            <div className="boardEditor__navigation">
                <Link to={props.prevPage}>Back</Link>
                <Link to={props.nextPage}>Continue</Link>
            </div>
        </div>
    );
}