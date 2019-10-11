import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import './CellLinker.css';
import { BoardDisplay } from '../../../components/board';
import { BoardDispatch } from '../BoardEditor';

interface Props {
    boardUrl: string;
}

export const CellLinker: React.FunctionComponent<Props> = props => {
    const context = useContext(BoardDispatch);

    return (
        <div className="boardEditor cellLinker">
            <BoardDisplay
                className="boardEditor__board"
                filePath={props.boardUrl}
            />
            
            <div className="boardEditor__content">
                Ability to automatically link cells
            </div>

            <div className="boardEditor__navigation">
                <Link to="/linktypes">Back</Link>
                <Link to="/regions">Continue</Link>
            </div>
        </div>
    );
}