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
        <div className="boardEditor boardEditor--links">
            <BoardDisplay
                className="boardEditor__board"
                filePath={props.boardUrl}
            />
            
            Ability to manage link types and link cells

            <Link to="/cells">Back</Link>
            <Link to="/regions">Continue</Link>
        </div>
    );
}