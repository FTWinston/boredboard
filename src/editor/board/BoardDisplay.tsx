import React, { useMemo } from 'react';
import { SvgLoader, SvgProxy } from 'react-svgmt';
import './BoardDisplay.css';

interface Props {
    filepath: string;
    className: string;
    cellClicked?: (cellID: string) => void;
    nonCellClicked?: (element: SVGElement) => void;
    selectableCells?: string[];
    moveableCells?: string[];
    attackableCells?: string[];
}

export const BoardDisplay: React.FunctionComponent<Props> = props => {
    const selectionProxy = useMemo(
        createProxy(props.selectableCells, 'board__cell--select'),
        [props.selectableCells]
    );

    const moveProxy = useMemo(
        createProxy(props.moveableCells, 'board__cell--move'),
        [props.moveableCells]
    );

    const attackProxy = useMemo(
        createProxy(props.attackableCells, 'board__cell--attack'),
        [props.attackableCells]
    );

    const className = props.className
        ? 'board ' + props.className
        : 'board';

    const elementClicked = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
        const target = e.target as SVGElement;

        const cellID = target.getAttribute('id');
        if (cellID !== null) {
            if (props.cellClicked) {
                props.cellClicked(cellID);
            }
        }
        else if (props.nonCellClicked) {
            props.nonCellClicked(target);
        }
    };

    // TODO: hook up elementClicked through onSVGReady ... somehow
    return (
        <div className={className}>
            <SvgLoader
                path={props.filepath}
                className="board__svg"
                onSVGReady={removeDimensions}
            >
                {selectionProxy}
                {moveProxy}
                {attackProxy}
            </SvgLoader>

            {props.children}
        </div>
    );
}

function removeDimensions(svg: SVGElement) {
    svg.removeAttribute('width');
    svg.removeAttribute('height');
    svg.removeAttribute('x');
    svg.removeAttribute('y');
}

function createProxy(cellIDs: string[] | undefined, className: string) {
    return () => {
        if (cellIDs === undefined) {
            return undefined;
        }

        return <SvgProxy
            selector={'#' + cellIDs.join(',#')}
            className={className}
        />
    }
}