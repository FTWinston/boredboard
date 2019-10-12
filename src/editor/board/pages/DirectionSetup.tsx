import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import './DirectionSetup.css';
import { BoardDisplay } from '../../../components/board';
import { BoardDispatch } from '../BoardEditor';

interface Props {
    boardUrl: string;
    cells: string[];
    linkTypes: string[];
}

export const DirectionSetup: React.FunctionComponent<Props> = props => {
    const context = useContext(BoardDispatch);
    
    return (
        <div className="boardEditor directionSetup">
            <BoardDisplay
                className="boardEditor__board"
                filePath={props.boardUrl}
                cells={props.cells}
            />

            <div className="boardEditor__content">
                Ability to specify how one link type is "relative" to another. E.g. north is "left" of east. Need a fixed list of relative direction types, and a list of link types. Relative direction names shouldn’t match link types.
            </div>

            <div className="boardEditor__navigation">
                <Link to="/manuallinks">Back</Link>
                <Link to="/directiongroups">Continue</Link>
            </div>
        </div>
    );
}