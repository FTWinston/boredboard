import React, { useContext, useState } from 'react';
import { Link } from 'react-router-dom';
import './BulkLinker.css';
import { BoardDisplay } from '../../../components/board';
import { BoardDispatch } from '../BoardEditor';
import { ILink } from '../boardReducer';
import { SelectAllNone } from '../components/SelectAllNone';
import { SelectorSingle } from '../components/SelectorSingle';

interface Props {
    boardUrl: string;
    cells: string[];
    linkTypes: string[];
    links: ILink[];
}

export const BulkLinker: React.FunctionComponent<Props> = props => {
    const context = useContext(BoardDispatch);

    const [selectedLinkType, setSelectedLinkType] = useState(props.linkTypes[0]);

    const [selectedCells, setSelectedCells] = useState([] as string[]);

    return (
        <div className="boardEditor bulkLinker">
            <BoardDisplay
                className="boardEditor__board"
                filePath={props.boardUrl}
                cells={props.cells}
                selectableCells={selectedCells}
                cellClicked={cell => {
                    let cells: string[];
                    const index = selectedCells.indexOf(cell);
                    if (index === -1) {
                        cells = [...selectedCells, cell];
                    }
                    else {
                        cells = selectedCells.slice();
                        cells.splice(index, 1);
                    }
                    setSelectedCells(cells);
                }}
            />
            
            <div className="boardEditor__content">
                <p>Click cells to select them, or select all with the button below.</p>
                
                <p>Choose a link type, a direction (relative to the screen) and a distance.</p>

                <p>Click <em>link</em> to trace outward from each starting point in the specified direction, and create a link of the selected type to any cell that is reached.</p>
                
                <p>If you want to manually add/remove individual links, the next step makes this easier.</p>

                <SelectAllNone
                    selectAll={
                        props.cells.length === selectedCells.length
                            ? undefined
                            : () => setSelectedCells(props.cells)
                    }
                    selectNone={
                        selectedCells.length === 0
                            ? undefined
                            : () => setSelectedCells([])
                    }
                />
                
                <SelectorSingle
                    prefixText="Link type:"
                    radioGroup="linkType"
                    options={props.linkTypes}
                    selectedValue={selectedLinkType}
                    selectValue={setSelectedLinkType}
                />

                <p>Screen direction</p>

                <p>Distance</p>

                <button>Create links</button>
            </div>

            <div className="boardEditor__navigation">
                <Link to="/linktypes">Back</Link>
                <Link to="/manuallinks">Continue</Link>
            </div>
        </div>
    );
}