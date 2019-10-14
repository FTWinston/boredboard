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
                <p>
                    If your link types represent directions then you can optionally specify how those directions
                    relate to each other. For example, in chess a knight moves two squares in one direction then
                    one square in an <em>orthogonal</em> direction (i.e. at 90 degrees to the original direction).
                    The concept of directions relating to each other lets us describe this without listing
                    several different options.
                </p>
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