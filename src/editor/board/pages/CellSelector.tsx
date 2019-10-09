import React, { useContext, useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import './CellSelector.css';
import { BoardDisplay, ICellItem } from '../../../components/board';
import { BoardDispatch } from '../BoardEditor';

interface Props {
    boardUrl: string;
    cells: IterableIterator<string>;
}

export const CellSelector: React.FunctionComponent<Props> = props => {
    const context = useContext(BoardDispatch);

    const [elementIDs, setElementIDs] = useState([] as string[]);

    const cellIdentifiers = useMemo(
        () => elementIDs.map(id => ({
            id: id,
            cell: id,
            display: <div>{id}</div>
        })),
        [elementIDs]
    );
    
    return (
        <div className="boardEditor boardEditor--cells">
            <BoardDisplay
                className="boardEditor__board"
                filePath={props.boardUrl}
                onReady={(svg, elements) => setElementIDs(elements.map(e => e.id).sort())}
                contents={cellIdentifiers}
            />
            
            <p>Below are listed the IDs of all the elements in this image. Please specify which elements are cells on the board.</p>
            
            <ul className="cellSelector__cellList">
                {elementIDs.map(id => (
                    <li
                        key={id}
                        className="cellSelector__cellID"
                        
                    >
                        {id}
                    </li>
                ))}
            </ul>

            <Link to="/image">Back</Link>
            <Link to="/links">Continue</Link>
        </div>
    );
}