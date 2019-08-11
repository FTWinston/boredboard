import React, { useMemo, useEffect, useReducer } from 'react';
import useFetch from 'react-fetch-hook';
import './BoardDisplay.css';
import { Mode } from '.';
import { cellReducer, IEditCellInfo, CellAction, getInitialCellState } from './cellReducer';

interface Props {
    filepath: string;
    mode: Mode;
}

export const BoardDisplay: React.FunctionComponent<Props> = props => {
    let rootDiv = React.createRef<HTMLDivElement>();

    const { isLoading, data: svgData } = useFetch(props.filepath,{
        formatter: (response) => response.text()
    });

    const [{ cells, nextId }, cellDispatch] = useReducer(cellReducer, getInitialCellState());

    const classes = useMemo(() => {
        if (isLoading || svgData === undefined) {
            return 'board board--loading';
        }

        switch (props.mode) {
            case 'mark cells': // TODO: priority 1
                return 'board board--markCells';
            case 'unmark cells': // TODO: priority 2
                return 'board board--unmarkCells';
            case 'create cells': // TODO: priority 4
                return 'board board--createCells';
            case 'auto link': // TODO: priority 3
                return 'board board--autoLink';
            case 'manual link': //  TODO: priority 1
                return 'board board--manualLink';
        }
    }, [isLoading, svgData, props.mode]);

    useEffect(() => {
        if (svgData === undefined || rootDiv.current === null) {
            return;
        }

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
    }, [svgData, rootDiv])

    // TODO: depending on mode, render an overlay of cell info ... e.g. their names

    return (
        <div
            ref={rootDiv}
            className={classes}
            dangerouslySetInnerHTML={svgData === undefined ? undefined : {__html: svgData}}
            onClick={e => elementClicked(e, props.mode, nextId, cellDispatch)}
        />
    );
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