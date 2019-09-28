import React, { useMemo } from 'react';
import useFetch from 'react-fetch-hook';
import './BoardDisplay.css';

interface Props {
    filepath: string;
    className: string;
    cellClicked?: (cellID: string) => void;
    nonCellClicked?: (element: SVGElement) => void;
    cellClasses?: Map<string, string>;
}

export const BoardDisplay: React.FunctionComponent<Props> = props => {
    let rootDiv = React.createRef<HTMLDivElement>();

    const { isLoading, data: rawSvgData } = useFetch(props.filepath, {
        formatter: async (response) => {
            const data = new DOMParser().parseFromString(await response.text(), 'image/svg+xml')
            data.documentElement.removeAttribute('width');
            data.documentElement.removeAttribute('height');
            data.documentElement.removeAttribute('x');
            data.documentElement.removeAttribute('y');
            return data;
        },
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

        return new XMLSerializer().serializeToString(modifiedSvgData);
    }, [rawSvgData, props.cellClasses]);

    const className = useMemo(() => {
        let classes = 'board';
        if (isLoading) {
            classes += ' board--loading';
        }
        else if (rawSvgData === undefined) {
            classes += ' board--error';
        }
        if (props.className !== undefined) {
            classes = `${classes} ${props.className}`;
        }
        return classes;
    }, [isLoading, rawSvgData, props.className]);

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

    return (
        <div
            ref={rootDiv}
            className={className}
            onClick={elementClicked}
            dangerouslySetInnerHTML={{__html: modifiedSvgData ? modifiedSvgData : 'Loading...'}}
        />
    );
}