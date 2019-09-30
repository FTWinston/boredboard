import React from 'react';

interface Props {
    leftOffset: number;
    topOffset: number;
    contents: ICellItem[];
    cellElements: Map<string, SVGGraphicsElement>;
}

export interface ICellItem {
    id: string;
    cell: string;
    display: JSX.Element | string;
}

export const ContentItems: React.FunctionComponent<Props> = props => {
    const contentItems = props.contents.map(item => {
        const element = props.cellElements.get(item.cell);

        if (element === undefined) {
            return undefined;
        }

        const bounds = element.getBoundingClientRect();
        const minSize = Math.min(bounds.width, bounds.height);
        
        const style = {
            top: `${bounds.top - props.topOffset}px`,
            left: `${bounds.left - props.leftOffset}px`,
            width: `${bounds.width}px`,
            height: `${bounds.height}px`,
            fontSize: `${minSize / 4}px`,
            padding: `${minSize / 10}px`,
        };

        return (
            <div
                key={item.id}
                className="board__contentItem"
                style={style}
                data-cell={item.cell}
            >
                {item.display}
            </div>
        )
    });

    return (
        <>
            {contentItems}
        </>
    );
}