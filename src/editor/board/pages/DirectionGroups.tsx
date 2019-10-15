import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import './DirectionGroups.css';
import { BoardDisplay } from '../../../components/board';
import { BoardDispatch } from '../BoardEditor';

interface Props {
    boardUrl: string;
    cells: string[];
    linkTypes: string[];
    relativeLinkTypes: string[];
}

export const DirectionGroups: React.FunctionComponent<Props> = props => {
    const context = useContext(BoardDispatch);
    
    return (
        <div className="boardEditor directionGroups">
            <BoardDisplay
                className="boardEditor__board"
                filePath={props.boardUrl}
                cells={props.cells}
            />

            <div className="boardEditor__content">
                Ability to group directions into e.g. “orthogonal”, “sideways” etc. These can include link types and directions. (i.e. global and local directions.)
            </div>

            <div className="boardEditor__navigation">
                <Link to="/playerdirections">Back</Link>
                <Link to="/regions">Continue</Link>
            </div>
        </div>
    );
}