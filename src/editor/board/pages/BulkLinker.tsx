import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import './BulkLinker.css';
import { BoardDisplay } from '../../../components/board';
import { BoardDispatch } from '../BoardEditor';
import { ILink } from '../boardReducer';

interface Props {
    boardUrl: string;
    cells: string[];
    linkTypes: string[];
    links: ILink[];
}

export const BulkLinker: React.FunctionComponent<Props> = props => {
    const context = useContext(BoardDispatch);

    return (
        <div className="boardEditor bulkLinker">
            <BoardDisplay
                className="boardEditor__board"
                filePath={props.boardUrl}
                cells={props.cells}
            />
            
            <div className="boardEditor__content">
                Ability to automatically link cells
            </div>

            <div className="boardEditor__navigation">
                <Link to="/linktypes">Back</Link>
                <Link to="/manuallinks">Continue</Link>
            </div>
        </div>
    );
}