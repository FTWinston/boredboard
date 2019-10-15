import React, { useState, useMemo, CSSProperties, useRef } from 'react';
import { Link } from 'react-router-dom';
import './BulkLinker.css';
import { BoardDisplay, ICellItem } from '../../../components/board';
import { ILink } from '../boardReducer';
import { MultiLinkSetup, ScreenDirection, getAngle } from '../components/MultiLinkSetup';
import { BoardLinkGroups } from '../components/BoardLinkGroups';

interface Props {
    boardUrl: string;
    cells: string[];
    linkTypes: string[];
    links: ILink[];
    nextPage: string;
    prevPage: string;
}

export const BulkLinker: React.FunctionComponent<Props> = props => {
    const root = useRef<HTMLDivElement>(null);

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

    const showLinkTypes = props.linkTypes.length > 1;

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
                <p>
                    Click cells to select them, or select all with the button below.<br/>
                    Choose {showLinkTypes ? 'a link type, ' : ''}a direction (relative to the screen) and a distance.
                </p>

                <p>Click <em>create links</em> to trace from each selected cell in the specified direction, and create links {showLinkTypes ? 'of the selected type ' : ''}to the cells that are reached.</p>
                
                <p>If you want to manually add/remove individual links, this is easier in the next step.</p>

                <div className="bulkLinker__columns">
                    <MultiLinkSetup
                        className="bulkLinker__createLinks"
                        cells={props.cells}
                        linkTypes={props.linkTypes}
                        links={props.links}
                        direction={direction}
                        setDirection={setDirection}
                        distance={distance}
                        setDistance={setDistance}
                        selectedCells={selectedCells}
                        setSelectedCells={setSelectedCells}
                        getBoardElements={() => root.current!.querySelectorAll('.board > .board__contentItem')}
                    />
                    
                    <BoardLinkGroups
                        className="bulkLinker__existingLinks"
                        links={props.links}
                    />
                </div>
            </div>

            <div className="boardEditor__navigation">
                <Link to={props.prevPage}>Back</Link>
                <Link to={props.nextPage}>Continue</Link>
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