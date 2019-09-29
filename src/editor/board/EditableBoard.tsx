import React, { useMemo, useReducer, useState } from 'react';
import { Mode } from './BoardEditor';
import { cellReducer, CellAction, getInitialCellState } from './cellReducer';
import { BoardDisplay } from '../../components/BoardDisplay';

interface Props {
    filepath: string;
    mode: Mode;
}

export const EditableBoard: React.FunctionComponent<Props> = props => {
    let rootDiv = React.createRef<HTMLDivElement>();

    const [{ cells, nextId }, cellDispatch] = useReducer(cellReducer, getInitialCellState());

    const classes = useMemo(() => {
        switch (props.mode) {
            case 'mark cells': // TODO: priority 1
                return 'board--markCells';
            case 'unmark cells': // TODO: priority 2
                return 'board--unmarkCells';
            case 'create cells': // TODO: priority 4
                return 'board--createCells';
            case 'auto link': // TODO: priority 3
                return 'board--autoLink';
            case 'manual link': //  TODO: priority 1
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

    return (
        <BoardDisplay
            className={classes}
            filepath={props.filepath}
            selectableCells={selectable}
            cellClicked={cell => cellClicked(cell, selectable, setSelectable)}
        />
    )
// onClick={e => elementClicked(e, props.mode, nextId, cellDispatch)}
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

    if (mode === 'mark cells') {
        target.setAttribute('id', nextId);

        cellDispatch({
            type: 'add cell',
            id: nextId,
            bounds: target.getBoundingClientRect(),
        });
    }
    else if (mode === 'unmark cells') {
        target.removeAttribute('id');

        cellDispatch({
            type: 'remove cell',
            id: target.getAttribute('id')!,
        });
    }
}