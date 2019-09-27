import React, { useMemo, useReducer } from 'react';
import { Mode } from '.';
import { cellReducer, CellAction, getInitialCellState } from './cellReducer';
import { BoardDisplay } from './BoardDisplay';

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
    // TODO: depending on mode, render an overlay of cell info ... e.g. their names

    const selectable = ['rect4084', 'rect4064'];
    const moveable = ['rect3990', 'rect3980'];
    const attackable = ['rect4096', 'rect4098'];

    return (
        <BoardDisplay
            className={classes}
            filepath={props.filepath}
            selectableCells={selectable}
            moveableCells={moveable}
            attackableCells={attackable}
        />
    )
// onClick={e => elementClicked(e, props.mode, nextId, cellDispatch)}
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