import React, { useContext, useState } from 'react';
import { Link } from 'react-router-dom';
import './CellSelector.css';
import { BoardDisplay } from '../../../components/board/BoardDisplay';
import { BoardDispatch } from '../BoardEditor';
import { LabelStyle } from '../../../data/LabelSize';
import { SelectAllNone } from '../components/SelectAllNone';
import { SelectorMulti } from '../components/SelectorMulti';

interface Props {
    boardUrl: string;
    cells: string[];
    nextPage: string;
    prevPage: string;
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

    const continueLink = props.cells.length === 0
        ? <div title="Cannot continue until cells are selected">Continue</div>
        : <Link to={props.nextPage}>Continue</Link>

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

                <SelectAllNone
                    selectAll={
                        props.cells.length === elementIDs.length
                            ? undefined
                            : () => context({ type: 'set cells', cells: elementIDs})
                    }
                    selectNone={
                        props.cells.length === 0
                            ? undefined
                            : () => context({ type: 'set cells', cells: []})
                    }
                />
                
                <div className="boardEditor__listTitle">Element IDs</div>

                <SelectorMulti
                    options={elementIDs}
                    selectedValues={props.cells}
                    changeValue={(cell, selected) => {
                        if (selected) {
                            context({ type: 'add cell', cell })
                        }
                        else {
                            context({ type: 'remove cell', cell })
                        }
                    }}
                />
            </div>

            <div className="boardEditor__navigation">
                <Link to={props.prevPage}>Back</Link>
                {continueLink}
            </div>
        </div>
    );
}