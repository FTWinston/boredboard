import React, { useContext, useState } from 'react';
import { Link } from 'react-router-dom';
import './CellSelector.css';
import { BoardDisplay } from '../../../components/board';
import { BoardDispatch } from '../BoardEditor';
import { LabelStyle } from '../../../data/LabelSize';

interface Props {
    boardUrl: string;
    cells: string[];
}

export const CellSelector: React.FunctionComponent<Props> = props => {
    const context = useContext(BoardDispatch);

    const [elementIDs, setElementIDs] = useState([] as string[]);
    
    const readBoardElements = (svg: SVGSVGElement, elements: SVGGraphicsElement[]) => {
        const ids = elements.map(e => e.id).sort();
        setElementIDs(ids);

        // if we had cells from a previous image, remove any that don't exist in the new one
        if (props.cells.length > 0) {
            const remainingCells = props.cells.filter(id => ids.indexOf(id) !== -1);
            if (remainingCells.length !== props.cells.length) {
                context({
                    type: 'set cells',
                    cells: remainingCells,
                });
            }
        }
    };

    const cellList = elementIDs.map(id => {
        const selected = props.cells.indexOf(id) !== -1;

        const classes = selected
            ? 'cellSelector__cellID cellSelector__cellID--selected'
            : 'cellSelector__cellID cellSelector__cellID--unselected';

        const clicked = (e: React.ChangeEvent<HTMLInputElement>) => {
            if (e.currentTarget.checked) {
                context({ type: 'add cell', cell: id })
            }
            else {
                context({ type: 'remove cell', cell: id })
            }
        };

        return (
            <label
                key={id}
                className={classes}
            >
                <input type="checkbox" checked={selected} onChange={clicked} />
                {id}
            </label>
        )
    });

    const continueLink = props.cells.length === 0
        ? <div title="Cannot continue until cells are selected">Continue</div>
        : <Link to="/linktypes">Continue</Link>

    return (
        <div className="boardEditor cellSelector">
            <BoardDisplay
                className="boardEditor__board"
                filePath={props.boardUrl}
                onReady={readBoardElements}
                cells={elementIDs}
                labelStyle={LabelStyle.FillCell}
                selectableCells={props.cells}
            />
            
            <div className="boardEditor__content">
                <p>
                    Below are listed the IDs of all the elements in this image.
                    <br/>Please select all the elements which represent cells on the board.
                </p>
                <p>
                    The IDs shown here will be used as cell names.
                    <br/>If you want to change them, go back a step and edit your board image.
                </p>
                <p>
                    If there's any elements that should be board cells, edit your board image (in notepad?) to give them IDs.
                </p>
                
                <div className="cellSelector__allNone">
                    <button disabled={props.cells.length === elementIDs.length} onClick={() => context({ type: 'set cells', cells: elementIDs})}>select all</button>
                    <button disabled={props.cells.length === 0} onClick={() => context({ type: 'set cells', cells: []})}>select none</button>
                </div>

                <div className="boardEditor__listTitle">Element IDs</div>
                <div className="cellSelector__cellList">
                    {cellList}
                </div>
            </div>

            <div className="boardEditor__navigation">
                <Link to="/image">Back</Link>
                {continueLink}
            </div>
        </div>
    );
}