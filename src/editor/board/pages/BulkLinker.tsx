import React, { useState, useMemo, CSSProperties, useRef } from 'react';
import './BulkLinker.css';
import { BoardDisplay } from '../../../components/board/BoardDisplay';
import { ICellItem } from '../../../components/board/ICellItem';
import { ILink } from '../boardReducer';
import { MultiLinkSetup, ScreenDirection, getAngle } from '../components/MultiLinkSetup';
import { BoardLinkGroups } from '../components/BoardLinkGroups';
import { NavLinks } from '../components/NavLinks';

interface Props {
    boardUrl: string;
    cells: ReadonlySet<string>;
    linkTypes: string[];
    links: ILink[];
    nextPage?: string;
    prevPage?: string;
    summaryPage?: string;
}

export const BulkLinker: React.FunctionComponent<Props> = props => {
    const root = useRef<HTMLDivElement>(null);

    const [selectedCells, setSelectedCells] = useState(new Set<string>());

    const [distance, setDistance] = useState(50);

    const [direction, setDirection] = useState('up' as ScreenDirection);

    const linkDisplays = useMemo(
        () => {
            const display = renderLinkPointer(direction, Math.round(distance));

            return [...selectedCells].map(cell => ({
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
                    let cells = new Set<string>(selectedCells);

                    if (cells.has(cell)) {
                        cells.delete(cell);
                    }
                    else {
                        cells.add(cell);
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
            
            <NavLinks
                prevPage={props.prevPage}
                nextPage={props.nextPage}
                summaryPage={props.summaryPage}
            />
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