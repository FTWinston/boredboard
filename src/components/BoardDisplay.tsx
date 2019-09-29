import React, { useMemo, useState } from 'react';
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
        () => createProxy(props.selectableCells, 'board__cell--select'),
        [props.selectableCells]
    );

    const moveProxy = useMemo(
        () => createProxy(props.moveableCells, 'board__cell--move'),
        [props.moveableCells]
    );

    const attackProxy = useMemo(
        () => createProxy(props.attackableCells, 'board__cell--attach'),
        [props.attackableCells]
    );

    const [svg, setSvg] = useState(undefined as SVGElement | undefined);

    const elementClicked = useMemo(() => (e: MouseEvent) => {
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
    }, [props.cellClicked, props.nonCellClicked]);

    const onReady = (svg: SVGElement) => {
        modifyImage(svg);
        setSvg(svg);
    }

    const className = props.className
        ? 'board ' + props.className
        : 'board';

    // TODO: how the hell do we get the modified board out once IDs have been assigned to the cells?
    // Can that be worked around?

    // Actually I find myself wondering if giving elements IDs is something to be avoided.
    // Could we just require that to have been done in advance when creating the SVG?

    // Can we store a ref to the root of the SVG from onReady?
    // If not, I guess a click anywhere in the SVG can trace its way up the tree to the root again.

    return (
        <div className={className}>
            <SvgLoader
                path={props.filepath}
                className="board__svg"
                onSVGReady={onReady}
                onClick={elementClicked}
            >
                <SvgProxy selector="[id]" class="" />
                {selectionProxy}
                {moveProxy}
                {attackProxy}
            </SvgLoader>

            {props.children}
        </div>
    );
}

function modifyImage(svg: SVGElement) {
    svg.removeAttribute('width');
    svg.removeAttribute('height');
    svg.removeAttribute('x');
    svg.removeAttribute('y');

    let filter = svg.ownerDocument!.createElement('filter');
    svg.appendChild(filter);
    filter.outerHTML = `<filter id="selectFilter">
    <feColorMatrix type="matrix" values="0.4 0 0 0 0 0.2 0.8 0.2 0 0.1 0.4 0.4 1 0 0.2 0 0 0 1 0" />
</filter>`;

    filter = svg.ownerDocument!.createElement('filter');
    svg.appendChild(filter);
    filter.outerHTML = `<filter id="moveFilter">
    <feColorMatrix type="matrix" values="1 0.4 0.4 0 0.2 0.2 0.8 0.2 0 0.1 0 0 0.2 0 0 0 0 0 1 0" />
</filter>`;

    filter = svg.ownerDocument!.createElement('filter');
    svg.appendChild(filter);
    filter.outerHTML = `<filter id="attackFilter">
    <feColorMatrix type="matrix" values="1 0.4 0.4 0 0.2 0 0.4 0 0 0 0 0 0.4 0 0 0 0 0 1 0" />
</filter>`;
}

function createProxy(cellIDs: string[] | undefined, className: string) {
    if (cellIDs === undefined || cellIDs.length === 0) {
        return undefined;
    }

    return <SvgProxy
        selector={'#' + cellIDs.join(',#')}
        class={className}
    />
}