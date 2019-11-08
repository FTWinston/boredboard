import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import './RegionCreator.css';
import { BoardDisplay } from '../../../components/board/BoardDisplay';
import { BoardDispatch } from '../BoardEditor';

interface Props {
    boardUrl: string;
    cells: ReadonlySet<string>;
    numPlayers: number;
    prevPage: string;
    nextPage: string;
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
                <Link to={props.prevPage}>Back</Link>
                <Link to={props.nextPage}>Continue</Link>
            </div>
        </div>
    );
}