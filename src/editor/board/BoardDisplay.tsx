import React, { useMemo, useState, useCallback } from 'react';
import useFetch from 'react-fetch-hook';
import './BoardDisplay.css';
import { Mode } from '.';

interface Props {
    filepath: string;
    mode: Mode;
}

export const BoardDisplay: React.FunctionComponent<Props> = props => {
    const { isLoading, data: svgData } = useFetch(props.filepath,{
        formatter: (response) => response.text()
    });

    const [nextId, setNextId] = useState(1);

    const idAllocated = useCallback(() => {
        // TODO: ensure "new nextId" isn't in use ... and remember we're putting a prefix on it when we use it. Argh.
        setNextId(nextId + 1);
    }, [nextId, setNextId])

    const classes = useMemo(() => {
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
    }, [props.mode]);

    if (isLoading || svgData === undefined) {
        return <div className="board board--loading" />
    }

    return (
        <div
            className={classes}
            dangerouslySetInnerHTML={{__html: svgData}}
            onClick={e => elementClicked(e, props.mode, nextId, idAllocated)}
        />
    );
}

function elementClicked(e: React.MouseEvent<HTMLDivElement, MouseEvent>, mode: Mode, nextId: number, idAllocated: () => void) {
    const target = e.target as HTMLElement;

    if (mode === 'mark cells') {
        target.setAttribute('id', `cell${nextId.toString()}`);
        idAllocated();
    }
    else if (mode === 'unmark cells') {
        target.removeAttribute('id');
    }
}