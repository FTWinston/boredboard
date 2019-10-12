import React, { useContext, useState, useMemo, CSSProperties, useRef } from 'react';
import { Link } from 'react-router-dom';
import './BulkLinker.css';
import { BoardDisplay, ICellItem } from '../../../components/board';
import { BoardDispatch } from '../BoardEditor';
import { ILink, BoardAction } from '../boardReducer';
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

    const root = useRef<HTMLDivElement>(null);

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
        <div className="boardEditor bulkLinker" ref={root}>
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

                <button
                    disabled={selectedCells.length === 0}
                    onClick={() => findAndLinkCells(root.current!, selectedCells, distance, direction, selectedLinkType, context)}
                >
                    Create links
                </button>
            </div>

            <div className="boardEditor__navigation">
                <Link to="/linktypes">Back</Link>
                <Link to="/manuallinks">Continue</Link>
            </div>
        </div>
    );
}

function renderLinkPointer(direction: ScreenDirection, distance: number) {
    const angle = getAngle(direction);

    const style: CSSProperties = {
        width: `${distance}px`,
        transform: `rotate(${angle}deg)`,
    };

    return (
        <div style={style} className="bulkLinker__pointer" />
    )
}

function getAngle(direction: ScreenDirection) {
    switch (direction) {
        case 'up':
            return -90;
        case 'down':
            return 90;
        case 'left':
            return 180;
        case 'up & left':
            return -135;
        case 'up & right':
            return -45;
        case 'down & left':
            return 135;
        case 'down & right':
            return 45;
        default:
            return 0;
    }
}

function findAndLinkCells(
    root: HTMLDivElement,
    selectedCells: string[],
    distance: number,
    screenDir: ScreenDirection,
    linkType: string,
    context: React.Dispatch<BoardAction>
) {
    const angle = getAngle(screenDir);

    const contentItems = root.querySelectorAll('.board > .board__contentItem');

    const newLinks: ILink[] = [];
    let numFailed = 0;

    for (const item of contentItems) {
        const fromCell = item.getAttribute('data-cell');
        if (fromCell === null || selectedCells.indexOf(fromCell) === -1) {
            continue;
        }
        
        const bounds = item.getBoundingClientRect();
        const centerX = bounds.left + bounds.width / 2;
        const centerY = bounds.top + bounds.height / 2;

        // TODO project to get these points
        const testX = centerX + 100;
        const testY = centerY + 100;

        const toElement = document.elementFromPoint(testX, testY);
        if (toElement === null) {
            numFailed++;
            continue;
        }

        // TODO: ensure we're still in the svg

        const toCell = toElement.id;
        if (toCell === '') {
            numFailed++;
            continue;
        }

        newLinks.push({
            fromCell,
            toCell,
            type: linkType,
        });
    }

    // TODO: create links into context, report on number created & failed
}