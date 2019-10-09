import React, { useMemo, useState, useRef, useCallback, useEffect } from 'react';
import { SvgLoader, SvgProxy } from 'react-svgmt';
import ResizeObserver from 'resize-observer-polyfill';
import './BoardDisplay.css';
import { ContentItems } from './ContentItems';
import { ICellItem } from './ICellItem';

interface Props {
    filePath: string;
    className: string;
    onReady?: (svg: SVGSVGElement, elements: SVGGraphicsElement[]) => void;
    cellClicked?: (cellID: string) => void;
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

    const elementClicked = useCallback((e: MouseEvent) => {
        const target = e.target as SVGGraphicsElement;

        const cellID = target.getAttribute('id');
        if (cellID !== null) {
            if (cellClicked) {
                cellClicked(cellID);
            }
        }
    }, [cellClicked]);

    const [cellElements, setCellElements] = useState(new Map<string, SVGGraphicsElement>());

    const [rootBounds, setRootBounds] = useState({ left: 0, top: 0, width: 0, height: 0 });

    useEffect(() => {
        const observer = new ResizeObserver(entries => {
            const bounds = entries[0].target.getBoundingClientRect();

            setRootBounds({
                top: bounds.top + window.scrollY,
                left: bounds.left + window.scrollX,
                width: bounds.width,
                height: bounds.height,
            });
        });
        observer.observe(root.current);
        
        return () => observer.disconnect();
    }, []);
    
    const className = props.className
        ? 'board ' + props.className
        : 'board';

    const onReady = (svg: SVGSVGElement) => {
        const elements = prepareImage(svg, setCellElements);

        if (props.onReady !== undefined) {
            props.onReady(svg, Array.from(elements));
        }
    };

    return (
        <div className={className} ref={root}>
            <SvgLoader
                path={props.filePath}
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
                leftOffset={rootBounds.left}
                topOffset={rootBounds.top}
                width={rootBounds.width}
                height={rootBounds.height}
            />
        </div>
    );
}

function prepareImage(svg: SVGSVGElement, setCellElements: (pos: Map<string, SVGGraphicsElement>) => void) {
    removeProblematicAttributes(svg);
    const elements = getCellElements(svg, setCellElements);
    createFilters(svg);
    return elements;
}

function removeProblematicAttributes(svg: SVGSVGElement) {
    svg.removeAttribute('width');
    svg.removeAttribute('height');
    svg.removeAttribute('x');
    svg.removeAttribute('y');
    svg.removeAttribute('id');
}

function getCellElements(svg: SVGSVGElement, setCellElements: (pos: Map<string, SVGGraphicsElement>) => void) {
    const elementList = svg.querySelectorAll('[id]') as NodeListOf<SVGGraphicsElement>;
    const cellElements = new Map<string, SVGGraphicsElement>();

    for (const cellElement of elementList) {
        cellElements.set(cellElement.id, cellElement);
    }

    setCellElements(cellElements);
    return elementList;
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