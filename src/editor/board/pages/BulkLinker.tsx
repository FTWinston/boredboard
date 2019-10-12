import React, { useContext, useState, useMemo, CSSProperties } from 'react';
import { Link } from 'react-router-dom';
import './BulkLinker.css';
import { BoardDisplay, ICellItem } from '../../../components/board';
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

type ScreenDirection = 'up' | 'down' | 'left' | 'right' | 'up & left' | 'up & right' | 'down & left' | 'down & right';
const screenDirections: ScreenDirection[] = ['up', 'down', 'left', 'right', 'up & left', 'up & right', 'down & left', 'down & right'];

export const BulkLinker: React.FunctionComponent<Props> = props => {
    const context = useContext(BoardDispatch);

    const [selectedLinkType, setSelectedLinkType] = useState(props.linkTypes[0]);

    const [selectedCells, setSelectedCells] = useState([] as string[]);

    const [distance, setDistance] = useState(50);

    const [direction, setDirection] = useState('up' as ScreenDirection);

    const linkDisplays = useMemo(
        () => {
            const display = renderLinkPointer(direction, Math.round(distance));

            return selectedCells.map(cell => ({
                key: cell,
                cell: cell,
                display,
            } as ICellItem))
        },
        [selectedCells, distance, direction]
    );

    return (
        <div className="boardEditor bulkLinker">
            <BoardDisplay
                className="boardEditor__board"
                filePath={props.boardUrl}
                cells={props.cells}
                selectableCells={selectedCells}
                contents={linkDisplays}
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

                <SelectorSingle
                    prefixText="Screen direction:"
                    radioGroup="screenDir"
                    options={screenDirections}
                    selectedValue={direction}
                    selectValue={val => setDirection(val as ScreenDirection)}
                />

                <p>
                    <button onClick={() => setDistance(distance * 1.2)}>Increase distance</button>
                    &nbsp;
                    <button onClick={() => setDistance(distance / 1.2)}>Decrease distance</button>
                </p>

                <button>Create links</button>
            </div>

            <div className="boardEditor__navigation">
                <Link to="/linktypes">Back</Link>
                <Link to="/manuallinks">Continue</Link>
            </div>
        </div>
    );
}

function renderLinkPointer(direction: ScreenDirection, distance: number) {
    let angle: number;

    switch (direction) {
        case 'up':
            angle = -90; break;
        case 'down':
            angle = 90; break;
        case 'left':
            angle = 180; break;
        case 'up & left':
            angle = -135; break;
        case 'up & right':
            angle = -45; break;
        case 'down & left':
            angle = 135; break;
        case 'down & right':
            angle = 45; break;
        default:
            angle = 0; break;
    }

    const style: CSSProperties = {
        width: `${distance}px`,
        transform: `rotate(${angle}deg)`,
    };

    return (
        <div style={style} className="bulkLinker__pointer" />
    )
}