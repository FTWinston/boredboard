import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import './DirectionSetup.css';
import { BoardDispatch } from '../BoardEditor';

interface Props {
    linkTypes: string[];
}

export const DirectionSetup: React.FunctionComponent<Props> = props => {
    const context = useContext(BoardDispatch);
    
    return (
        <div className="boardEditor directionSetup">
            <div className="boardEditor__board">
                Manage a list of relative directions here (e.g. tangential &amp; opposite or left &amp; right)
            </div>

            <div className="boardEditor__content">
                Show each of your link types here, allow specifying other link types for each relative direction.
            </div>

            <div className="boardEditor__navigation">
                <Link to="/manuallinks">Back</Link>
                <Link to="/directiongroups">Continue</Link>
            </div>
        </div>
    );
}