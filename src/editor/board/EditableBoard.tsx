import React, { useMemo, useReducer, useState } from 'react';
import { Mode } from './BoardEditor';
import { cellReducer, CellAction, getInitialCellState } from './cellReducer';
import { BoardDisplay, ICellItem } from '../../components/board';

interface Props {
    filepath: string;
    mode: Mode;
}

export const EditableBoard: React.FunctionComponent<Props> = props => {
    const [{ cells, nextId }, cellDispatch] = useReducer(cellReducer, getInitialCellState());

    const classes = useMemo(() => {
        switch (props.mode) {
            case 'check cells':
                return 'board--checkCells';
            case 'auto link':
                return 'board--autoLink';
            case 'manual link':
                return 'board--manualLink';
        }
    }, [props.mode]);

/*
    useEffect(() => {
        const loadingCells = Array.from(rootDiv.current.querySelectorAll('svg [id]'))
            .map(element => {
                const bounds = element.getBoundingClientRect();
                return {
                    id: element.id,
                    bounds: bounds,
                    links: new Map<string, IEditCellInfo[]>(),
                }
            });

        cellDispatch({
            type: 'set cells',
            cells: loadingCells,
        });
    }, [rootDiv])
*/
    const [selectable, setSelectable] = useState([] as string[]);
    
    const contents: ICellItem[] = [
        { id: 'item1', cell: 'rect4080', display: <div>In Rect 4080</div>}
    ];

    return (
        <BoardDisplay
            className={classes}
            filePath={props.filepath}
            selectableCells={selectable}
            cellClicked={cell => cellClicked(cell, selectable, setSelectable)}
            contents={contents}
        />
    )
}

function cellClicked(cell: string, selectable: string[], setSelectable: (ids: string[]) => void) {
    const index = selectable.indexOf(cell);
    const newSelectable = selectable.slice();

    if (index === -1) {
        newSelectable.push(cell);
    }
    else {
        newSelectable.splice(index, 1)
    }

    setSelectable(newSelectable);
}

function elementClicked(e: React.MouseEvent<HTMLDivElement, MouseEvent>, mode: Mode, nextId: string, cellDispatch: React.Dispatch<CellAction>) {
    const target = e.target as HTMLElement;

    if (mode === 'check cells') {
        target.setAttribute('id', nextId);

        cellDispatch({
            type: 'add cell',
            id: nextId,
            bounds: target.getBoundingClientRect(),
        });
    }
}