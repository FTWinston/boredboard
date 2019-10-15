import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import './PlayerLinks.css';
import { BoardDisplay } from '../../../components/board';
import { BoardDispatch } from '../BoardEditor';

interface Props {
    boardUrl: string;
    cells: string[];
    linkTypes: string[];
    numPlayers: number;
    prevPage: string;
    nextPage: string;
}

export const PlayerLinks: React.FunctionComponent<Props> = props => {
    const context = useContext(BoardDispatch);
    
    return (
        <div className="boardEditor playerLinks">
            <BoardDisplay
                className="boardEditor__board"
                filePath={props.boardUrl}
                cells={props.cells}
            />

            <div className="boardEditor__content">
                Ability to optionally associate each player with a direction. This will be their "forward" direction.
            </div>

            <div className="boardEditor__navigation">
                <Link to={props.prevPage}>Back</Link>
                <Link to={props.nextPage}>Continue</Link>
            </div>
        </div>
    );
}