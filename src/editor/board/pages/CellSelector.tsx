import React, { useContext, useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import './CellSelector.css';
import { BoardDisplay, ICellItem } from '../../../components/board';
import { BoardDispatch } from '../BoardEditor';

interface Props {
    boardUrl: string;
    cells: string[];
}

export const CellSelector: React.FunctionComponent<Props> = props => {
    const context = useContext(BoardDispatch);

    const [elementIDs, setElementIDs] = useState([] as string[]);

    const cellIdentifiers: ICellItem[] = useMemo(
        () => elementIDs.map(id => ({
            id: id,
            cell: id,
            display: <div>{id}</div>
        })),
        [elementIDs]
    );
    
    const readBoardElements = (svg: SVGSVGElement, elements: SVGGraphicsElement[]) => {
        const ids = elements.map(e => e.id).sort();
        setElementIDs(ids);

        if (props.cells.length === 0) {
            // if we had no previous cells/image, select all elements from the current image
            context({
                type: 'set cells',
                cells: ids,
            });
        }
        else {
            // if we had cells from a previous image, only keep those that exist in the new one
            const remainingCells = props.cells.filter(id => ids.indexOf(id) !== -1);
            if (remainingCells.length !== props.cells.length) {
                context({
                    type: 'set cells',
                    cells: remainingCells,
                });
            }
        }
    };

    const cellNames = elementIDs.map(id => {
        const selected = props.cells.indexOf(id) !== -1;

        const classes = selected
            ? 'cellSelector__cellID cellSelector__cellID--selected'
            : 'cellSelector__cellID cellSelector__cellID--unselected';

        const clicked = selected
            ? () => context({ type: 'remove cell', cell: id })
            : () => context({ type: 'add cell', cell: id })

        return (
            <li
                key={id}
                className={classes}
                onClick={clicked}
            >
                {id}
            </li>
        )
    });

    return (
        <div className="boardEditor boardEditor--cells">
            <BoardDisplay
                className="boardEditor__board"
                filePath={props.boardUrl}
                onReady={readBoardElements}
                contents={cellIdentifiers}
                selectableCells={props.cells}
            />
            
            <p>Below are listed the IDs of all the elements in this image. Please specify which elements are cells on the board.</p>
            
            <ul className="cellSelector__cellList">
                {cellNames}
            </ul>

            <Link to="/image">Back</Link>
            <Link to="/links">Continue</Link>
        </div>
    );
}