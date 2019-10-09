import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import './CellSelector.css';
import { BoardDisplay } from '../../../components/board';
import { BoardDispatch } from '../BoardEditor';

interface Props {
    boardUrl: string;
}

export const CellSelector: React.FunctionComponent<Props> = props => {
    const context = useContext(BoardDispatch);

    return (
        <div className="boardEditor boardEditor--cells">
            <BoardDisplay
                className="boardEditor__board"
                filePath={props.boardUrl}
            />
            
            List the available cells here.

            <Link to="/image">Back</Link>
            <Link to="/links">Continue</Link>
        </div>
    );
}