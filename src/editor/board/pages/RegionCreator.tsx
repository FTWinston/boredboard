import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import './RegionCreator.css';
import { BoardDisplay } from '../../../components/board';
import { BoardDispatch } from '../BoardEditor';

interface Props {
    boardUrl: string;
}

export const RegionCreator: React.FunctionComponent<Props> = props => {
    const context = useContext(BoardDispatch);
    
    return (
        <div className="boardEditor regionCreator">
            <BoardDisplay
                className="boardEditor__board"
                filePath={props.boardUrl}
            />

            <div className="boardEditor__content">
                Ability to create board regions, both general and per-player
            </div>

            <div className="boardEditor__navigation">
                <Link to="/links">Back</Link>
                <Link to="/">Continue</Link>
            </div>
        </div>
    );
}