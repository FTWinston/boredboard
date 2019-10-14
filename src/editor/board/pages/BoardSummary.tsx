import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import './BoardSummary.css';
import { BoardDisplay, ICellItem } from '../../../components/board';
import { LabelStyle } from '../../../data/LabelSize';
import { ILink, IRegion } from '../boardReducer';

interface Props {
    boardUrl: string;
    cells: string[];
    linkTypes: string[];
    links: ILink[];
    regions: IRegion[];
    saveData: () => void;
}

export const BoardSummary: React.FunctionComponent<Props> = props => {
    const [selectedCell, setSelectedCell] = useState(undefined as string | undefined);
    
    const [destinationCells, cellContents] = useMemo(
        () => {
            if (selectedCell === undefined) {
                return [undefined, undefined];
            }

            const links = props.links.filter(l => l.fromCell === selectedCell);

            const destCells = links.map(l => l.toCell);

            const contentItems: ICellItem[] = links.map(l => ({
                key: l.toCell + l.type,
                cell: l.toCell,
                display: l.type,
            }));

            const regions = props.regions.filter(r => r.cells.indexOf(selectedCell) !== -1);
            
            contentItems.push({
                key: selectedCell,
                cell: selectedCell,
                display: regions.map((r, i) => <div key={i}>{r}</div>),
            });

            return [destCells, contentItems];
        },
        [selectedCell, props.links, props.regions]
    );

    const directionLinks = props.linkTypes.length > 1
        ? <>
            <li><Link to="/directions">Relative directions</Link></li>
            <li><Link to="/directiongroups">Direction groups</Link></li>
            <li><Link to="/playerdirections">Player directions</Link></li>
        </>
        : undefined;

    return (
        <div className="boardEditor boardSummary">
            <BoardDisplay
                className="boardEditor__board"
                filePath={props.boardUrl}
                labelStyle={LabelStyle.SmallCorner}
                cells={props.cells}
                cellClicked={cell => setSelectedCell(cell)}
                selectableCells={selectedCell === undefined ? undefined : [selectedCell]}
                moveableCells={destinationCells}
                contents={cellContents}
            />

            <div className="boardEditor__content">            
                <p>
                    If you're finished setting up this board, you can save it here.
                </p>

                <p>
                    Links to each step of the board setup process are available below.
                </p>

                <p>
                    To test your board, select a cell, and its region(s) will be shown, all linked cell will be highlighted, and their link types will be shown.
                </p>

                <ol>
                    <li><Link to="/image">Change image</Link></li>
                    <li><Link to="/cells">Modify cells</Link></li>
                    <li><Link to="/linktypes">Link types</Link></li>
                    <li><Link to="/bulklinks">Bulk links</Link></li>
                    <li><Link to="/manuallinks">Manual links</Link></li>
                    {directionLinks}
                    <li><Link to="/regions">Modify regions</Link></li>
                </ol>
            </div>

            <div className="boardEditor__navigation">
                <button onClick={props.saveData}>save board</button>
            </div>
        </div>
    );
}