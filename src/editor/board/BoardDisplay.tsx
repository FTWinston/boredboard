import React, { useMemo, useState, useCallback, useEffect } from 'react';
import useFetch from 'react-fetch-hook';
import './BoardDisplay.css';
import { Mode } from '.';

interface Props {
    filepath: string;
    mode: Mode;
}

interface CellInfo {
    links: Map<string, string>;
}

export const BoardDisplay: React.FunctionComponent<Props> = props => {
    let rootDiv = React.createRef<HTMLDivElement>();

    const { isLoading, data: svgData } = useFetch(props.filepath,{
        formatter: (response) => response.text()
    });

    const [cells, setCells] = useState(new Map<string, CellInfo>());

    const [nextId, setNextId] = useState(1);

    const idAllocated = useCallback(() => {
        // TODO: ensure "new nextId" isn't in use ... and remember we're putting a prefix on it when we use it. Argh.
        setNextId(nextId + 1);
    }, [nextId, setNextId])

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

        const elementsWithIDs = Array.from(rootDiv.current.querySelectorAll('svg [id]'));
        const loadingCells = new Map<string, CellInfo>();
        for (const element of elementsWithIDs) {
            loadingCells.set(element.id, {
                links: new Map<string, string>(),
            });
        }

        setCells(loadingCells);
    }, [svgData, rootDiv])

    return (
        <div
            ref={rootDiv}
            className={classes}
            dangerouslySetInnerHTML={svgData === undefined ? undefined : {__html: svgData}}
            onClick={e => elementClicked(e, props.mode, nextId, idAllocated)}
        />
    );
}

function elementClicked(e: React.MouseEvent<HTMLDivElement, MouseEvent>, mode: Mode, nextId: number, idAllocated: () => void) {
    const target = e.target as HTMLElement;

    if (mode === 'mark cells') {
        target.setAttribute('id', `cell${nextId.toString()}`);
        idAllocated();

        // TODO: update cells ... use a reducer?
    }
    else if (mode === 'unmark cells') {
        target.removeAttribute('id');

        // TODO: update cells ... use a reducer?
    }
}