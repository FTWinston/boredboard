import React, { useMemo, useState, useRef } from 'react';
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
    contents?: ICellItem[];
}

export interface ICellItem {
    id: string;
    cell: string;
    display: JSX.Element | string;
}

interface IRect {
    left: number;
    top: number;
    width: number;
    height: number;
}

export const BoardDisplay: React.FunctionComponent<Props> = props => {
    const root = useRef<HTMLDivElement>(null);

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

    const cellClicked = props.cellClicked;
    const nonCellClicked = props.nonCellClicked;

    const elementClicked = useMemo(() => (e: MouseEvent) => {
        const target = e.target as SVGGraphicsElement;

        const cellID = target.getAttribute('id');
        if (cellID !== null) {
            if (cellClicked) {
                cellClicked(cellID);
            }
        }
        else if (nonCellClicked) {
            nonCellClicked(target);
        }
    }, [cellClicked, nonCellClicked]);

    const [cellBounds, setCellPositions] = useState(new Map<string, IRect>());

    const contentItems = useMemo(
        () => {
            if (props.contents === undefined || root.current === null) {
                return undefined;
            }

            const rootBounds = root.current.getBoundingClientRect();

            return props.contents.map(item => {
                const bounds = cellBounds.get(item.cell);

                if (bounds === undefined) {
                    return undefined;
                }

                const xPadding = bounds.width * 0.1;
                const yPadding = bounds.height * 0.1;

                const style = {
                    top: `${bounds.top + yPadding - rootBounds.top}px`,
                    left: `${bounds.left + xPadding - rootBounds.left}px`,
                    width: `${bounds.width - xPadding - xPadding}px`,
                    height: `${bounds.height - yPadding - yPadding}px`,
                };

                return (
                    <div className="board__contentItem" key={item.id} style={style} data-cell={item.cell}>
                        {item.display}
                    </div>
                )
            });
        },
        [props.contents, cellBounds]
    );

    const className = props.className
        ? 'board ' + props.className
        : 'board';

    const onReady = (svg: SVGElement) => prepareImage(svg, setCellPositions);

    return (
        <div className={className} ref={root}>
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

            {contentItems}
        </div>
    );
}

function prepareImage(svg: SVGElement, setCellPositions: (pos: Map<string, IRect>) => void) {
    removeProblematicAttributes(svg);
    determineCellPositions(svg, setCellPositions);
    createFilters(svg);
}

function removeProblematicAttributes(svg: SVGElement) {
    svg.removeAttribute('width');
    svg.removeAttribute('height');
    svg.removeAttribute('x');
    svg.removeAttribute('y');
    svg.removeAttribute('id');
}

function determineCellPositions(svg: SVGElement, setCellPositions: (pos: Map<string, IRect>) => void) {
    const cellElements = svg.querySelectorAll('[id]') as NodeListOf<SVGGraphicsElement>;
    const cellPositions = new Map<string, IRect>();

    for (const cellElement of cellElements) {
        const point = getBounds(cellElement, svg);
        cellPositions.set(cellElement.id, point);
    }

    setCellPositions(cellPositions);
}

function createFilters(svg: SVGElement) {
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

function getBounds(element: SVGGraphicsElement, svg: SVGElement): IRect {
    const bounds = element.getBoundingClientRect();
    
    return {
        left: bounds.left,
        top: bounds.top,
        width: bounds.width,
        height: bounds.height,
    }
}