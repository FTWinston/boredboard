import React, { useMemo, useState, useRef, useCallback, useLayoutEffect } from 'react';
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

export const BoardDisplay: React.FunctionComponent<Props> = props => {
    const root = useRef<HTMLDivElement>({offsetWidth: 0, offsetHeight: 0} as any as HTMLDivElement);

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

    const elementClicked = useCallback((e: MouseEvent) => {
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

    const [cellElements, setCellElements] = useState(new Map<string, SVGGraphicsElement>());

    const rootWidth = root.current.offsetWidth;
    const rootHeight = root.current.offsetHeight;

    const [contentItems, setContentItems] = useState([] as Array<JSX.Element | undefined>);

    useLayoutEffect(
        () => {
            if (props.contents === undefined || root.current.getBoundingClientRect === undefined) {
                setContentItems([]);
                return;
            }

            const rootBounds = root.current.getBoundingClientRect();

            /*
            BUG: this call to setContentItems stops selection changes from rendering
            (or rather, rerenders again immediately without them ... looks like)
            even if contentItems aren't used in the render. It's the callback that counts.

            When this is in useLayoutEffect instead of useEffect, we don't get a re-render,
            so there isn't the brief flash of correctly-highlighted cells.

            This is weird. cellElements is the only place we refer to the SVG,
            and highlighting is done entirely in the SVG! (Adding/removing class, like)

            As it is, it renders twice with each change:
                Once cos the selection changed, and then once for the effect.
                ...why does the effect change?
                Cos props.contents is remade each render of the parent.
                If I remove the dependency on that, selection works fine!
            */
            setContentItems(props.contents.map(item => {
                const element = cellElements.get(item.cell);

                if (element === undefined) {
                    return undefined;
                }

                const bounds = element.getBoundingClientRect();
                const minSize = Math.min(bounds.width, bounds.height);
                
                const style = {
                    top: `${bounds.top - rootBounds.top}px`,
                    left: `${bounds.left - rootBounds.left}px`,
                    width: `${bounds.width}px`,
                    height: `${bounds.height}px`,
                    fontSize: `${minSize / 4}px`,
                    padding: `${minSize / 10}px`,
                };

                return (
                    <div className="board__contentItem" key={item.id} style={style} data-cell={item.cell}>
                        {item.display}
                    </div>
                )
            }));
        },
        [props.contents, props.filepath, cellElements, rootWidth, rootHeight]
    );

    const className = props.className
        ? 'board ' + props.className
        : 'board';

    const onReady = (svg: SVGElement) => prepareImage(svg, setCellElements);

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

function prepareImage(svg: SVGElement, setCellElements: (pos: Map<string, SVGGraphicsElement>) => void) {
    removeProblematicAttributes(svg);
    getCellElements(svg, setCellElements);
    createFilters(svg);
}

function removeProblematicAttributes(svg: SVGElement) {
    svg.removeAttribute('width');
    svg.removeAttribute('height');
    svg.removeAttribute('x');
    svg.removeAttribute('y');
    svg.removeAttribute('id');
}

function getCellElements(svg: SVGElement, setCellElements: (pos: Map<string, SVGGraphicsElement>) => void) {
    const elementList = svg.querySelectorAll('[id]') as NodeListOf<SVGGraphicsElement>;
    const cellElements = new Map<string, SVGGraphicsElement>();

    for (const cellElement of elementList) {
        cellElements.set(cellElement.id, cellElement);
    }

    setCellElements(cellElements);
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