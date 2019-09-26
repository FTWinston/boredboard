import React, { useMemo } from 'react';
import useFetch from 'react-fetch-hook';
import './BoardDisplay.css';

interface Props {
    filepath: string;
    className: string;
    cellClicked?: (element: SVGElement) => void;
    nonCellClicked?: (element: SVGElement) => void;
    cellContent?: Map<string, JSX.Element[]>;
    cellClasses?: Map<string, string>;
}

export const BoardDisplay: React.FunctionComponent<Props> = props => {
    let rootDiv = React.createRef<HTMLDivElement>();

    const { isLoading, data: rawSvgData } = useFetch(props.filepath,{
        formatter: async (response) => new DOMParser().parseFromString(await response.text(), 'image/svg+xml'),
    });

    const modifiedSvgData = useMemo(() => {
        if (rawSvgData === undefined) {
            return undefined;
        }

        const modifiedSvgData = rawSvgData.cloneNode(true) as Document;

        if (props.cellClasses) {
            for (const [id, className] of props.cellClasses) {
                const element = modifiedSvgData.getElementById(id);
                if (element) {
                    element.classList.add(className);
                }
            }
        }

        /*
        if (props.cellContent) {
            for (const [id, content] of props.cellContent) {
                const element = modifiedSvgData.getElementById(id);
                if (element) {
                    element.innerHTML = content;
                }
            }
        }
        */

        return new XMLSerializer().serializeToString(modifiedSvgData);
    }, [rawSvgData, props.cellContent, props.cellClasses]);

    const className = useMemo(() => {
        let classes = 'board';
        if (isLoading || modifiedSvgData === undefined) {
            classes += ' board--loading';
        }
        if (props.className !== undefined) {
            classes = `${classes} ${props.className}`;
        }
        return classes;
    }, [isLoading, modifiedSvgData, props.className]);

    const elementClicked = useMemo(() => {
        return (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
            const target = e.target as SVGElement;

            if (target.hasAttribute('id')) {
                if (props.cellClicked) {
                    props.cellClicked(target);
                }
            }
            else if (props.nonCellClicked) {
                props.nonCellClicked(target);
            }
        }
    }, [props.cellClicked, props.nonCellClicked]);

    return (
        <div
            ref={rootDiv}
            className={className}
            onClick={elementClicked}
            dangerouslySetInnerHTML={{__html: modifiedSvgData ? modifiedSvgData : 'Loading...'}}
        />
    );
}