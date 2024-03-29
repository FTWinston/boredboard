import React, { useState, useMemo } from 'react';
import { Link, RouteComponentProps, withRouter, useHistory } from 'react-router-dom';
import './BoardSummary.css';
import { BoardDisplay } from '../../../components/board/BoardDisplay';
import { ICellItem } from '../../../components/board/ICellItem';
import { LabelStyle } from '../../../data/LabelSize';
import { ILink, IRegionCell } from '../boardReducer';

interface Props extends RouteComponentProps {
    boardUrl: string;
    cells: ReadonlySet<string>;
    linkTypes: string[];
    links: ILink[];
    regionCells: IRegionCell[];
    saveData: () => void;
    closeUrl: string;
}

const BoardSummary: React.FunctionComponent<Props> = props => {
    const history = useHistory();

    const close = useMemo(() => 
        () => history.push(props.closeUrl),
        [props.closeUrl, history]
    );

    const { saveData } = props;
    const saveAndClose = useMemo(() => 
        () => {
            saveData();
            close();
        },
        [saveData, close]
    );

    const [selectedCell, setSelectedCell] = useState(undefined as string | undefined);
    
    const [destinationCells, cellContents] = useMemo(
        () => {
            if (selectedCell === undefined) {
                return [undefined, undefined];
            }

            const links = props.links.filter(l => l.fromCell === selectedCell);

            const destCells = new Set<string>(links.map(l => l.toCell));

            const contentItems: ICellItem[] = links.map(l => ({
                key: l.toCell + l.type,
                cell: l.toCell,
                display: l.type,
            }));

            const regions = props.regionCells
                .filter(r => r.cell === selectedCell)
                .map(r => r.player === 0 ? r.region : `${r.region} (player ${r.player})`);
            
            contentItems.push({
                key: selectedCell,
                cell: selectedCell,
                display: regions.map(r => <div key={r}>{r}</div>),
            });

            return [destCells, contentItems];
        },
        [selectedCell, props.links, props.regionCells]
    );

    const directionLinks = props.linkTypes.length > 1
        ? <>
            <li><Link to={`${props.match.url}/directions`}>Relative directions</Link></li>
            <li><Link to={`${props.match.url}/directiongroups`}>Direction groups</Link></li>
            <li><Link to={`${props.match.url}/playerdirections`}>Player directions</Link></li>
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
                selectableCells={selectedCell === undefined ? undefined : new Set<string>([selectedCell])}
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
                    <li><Link to={`${props.match.url}/image`}>Change image</Link></li>
                    <li><Link to={`${props.match.url}/cells`}>Modify cells</Link></li>
                    <li><Link to={`${props.match.url}/linktypes`}>Link types</Link></li>
                    <li><Link to={`${props.match.url}/bulklinks`}>Bulk links</Link></li>
                    <li><Link to={`${props.match.url}/manuallinks`}>Manual links</Link></li>
                    {directionLinks}
                    <li><Link to={`${props.match.url}/regions`}>Modify regions</Link></li>
                </ol>
            </div>

            <div className="boardEditor__navigation">
                <button onClick={close}>discard changes</button>
                <button onClick={saveAndClose}>save board</button>
            </div>
        </div>
    );
}

export default withRouter(BoardSummary);