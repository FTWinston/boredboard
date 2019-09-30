import React, { useMemo, useState, useRef, useCallback, useEffect } from 'react';
import { SvgLoader, SvgProxy } from 'react-svgmt';
import ResizeObserver from 'resize-observer-polyfill';
import './BoardDisplay.css';
import { ICellItem, ContentItems } from './ContentItems';

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

    const className = props.className
        ? 'board ' + props.className
        : 'board';

    const onReady = (svg: SVGElement) => prepareImage(svg, setCellElements);

    const [[leftOffset, topOffset], setRootOffsets] = useState([0, 0]);

    useEffect(() => {
        const observer = new ResizeObserver(entries => {
            const bounds = entries[0].contentRect;  // scrolling and offset-from-zero cause position errors
            //const bounds = entries[0].target.getBoundingClientRect(); // scrolling not quite right, can still move out of position
            // Presumably these bugs relate to what resizes ContentItmes and what doesn't.
            // Should we give it width and height properties? probably
            setRootOffsets([bounds.left, bounds.top]);
        });
        observer.observe(root.current);
        
        return () => observer.disconnect();
    }, []);
/*
    const [[leftOffset2, topOffset2], setRootOffsets2] = useState([0, 0]);
    useLayoutEffect(() => {
        if (root.current.getBoundingClientRect === undefined) {
            setRootOffsets2([0, 0]);
            return;
        }
        const bounds = root.current.getBoundingClientRect(); // TODO THIS INCLUDES SCROLL!! FFS!
        setRootOffsets2([bounds.left, bounds.top]);
    }, [root.current.offsetWidth, root.current.offsetHeight, props.className]);//, cellElements, props.contents]);

    console.log(`first mode gives ${leftOffset} x ${topOffset}, second gives ${leftOffset2} x ${topOffset2}`)
*/
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

            <ContentItems
                cellElements={cellElements}
                contents={props.contents === undefined ? [] : props.contents}
                leftOffset={leftOffset}
                topOffset={topOffset}
            />
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