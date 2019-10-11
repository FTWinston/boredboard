import React from 'react';
import { Link } from 'react-router-dom';
import './RegionCreator.css';
import { BoardDisplay } from '../../../components/board';

interface Props {
    boardUrl: string;
    cells: string[];
}

export const BoardSummary: React.FunctionComponent<Props> = props => {
    // TODO: clicking a cell should show its name and any regions it's in, highlight linked cells and put the link type in them

    return (
        <div className="boardEditor boardSummary">
            <BoardDisplay
                className="boardEditor__board"
                filePath={props.boardUrl}
                cells={props.cells}
            />

            <div className="boardEditor__content">            
                Overview of your board, link to save &amp; exit, and links to each step of the process.
            </div>

            <div className="boardEditor__navigation">
                <Link to="/image">Change image</Link>
                <Link to="/cells">Modify cells</Link>
                <Link to="/links">Modify links</Link>
                <Link to="/regions">Modify regions</Link>
            </div>
        </div>
    );
}