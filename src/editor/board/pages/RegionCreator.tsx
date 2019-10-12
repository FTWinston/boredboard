import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import './RegionCreator.css';
import { BoardDisplay } from '../../../components/board';
import { BoardDispatch } from '../BoardEditor';

interface Props {
    boardUrl: string;
    cells: string[];
}

export const RegionCreator: React.FunctionComponent<Props> = props => {
    const context = useContext(BoardDispatch);
    
    return (
        <div className="boardEditor regionCreator">
            <BoardDisplay
                className="boardEditor__board"
                filePath={props.boardUrl}
                cells={props.cells}
            />

            <div className="boardEditor__content">
                Ability to create board regions, both general and per-player
            </div>

            <div className="boardEditor__navigation">
                <Link to="/manuallinks">Back</Link>
                <Link to="/">Continue</Link>
            </div>
        </div>
    );
}