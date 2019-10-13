import React, { useContext, useState, useMemo } from 'react';
import { BoardDispatch } from '../BoardEditor';
import { ILink } from '../boardReducer';

interface Props {
    className?: string;
    links: ILink[];
}

export const BoardLinkGroups: React.FunctionComponent<Props> = props => {
    const context = useContext(BoardDispatch);

    const [lastRemoved, setLastRemoved] = useState(null as ILink[] | null);

    const existingLinkDisplays = useMemo(() => {
        const groupCounts = countLinksByType(props.links);

        const results: JSX.Element[] = [];

        for (const [linkType, count] of groupCounts) {
            results.push(
                <div
                    key={linkType}
                    className="bulkLinker__link"
                    onClick={() => {
                        setLastRemoved(props.links.filter(l => l.type === linkType));
    
                        context({
                            type: 'set links',
                            links: props.links.filter(l => l.type !== linkType)
                        });
                    }}
                >
                    {count}x {linkType}
                </div>
            )
        }

        return results;
    }, [props.links, context]);

    const undoButton = useMemo(() => {
        if (lastRemoved === null) {
            return undefined;
        }

        return (
            <button onClick={() => {
                context({
                    type: 'add links',
                    links: lastRemoved,
                });
                
                setLastRemoved(null);
            }}>
                restore removed links
            </button>
        );
    }, [lastRemoved, context]);

    return (
        <div className={props.className}>
            <div className="boardEditor__listTitle">Existing links</div>
            <p>Click an existing link group to remove it.</p>

            <div className="bulkLinker__existingLinkList">
                {existingLinkDisplays}
            </div>

            {undoButton}
        </div>
    );
}

function countLinksByType(links: ILink[]) {
    const counts = new Map<string, number>();

    for (const link of links) {
        const existing = counts.get(link.type);

        if (existing === undefined) {
            counts.set(link.type, 1);
        }
        else {
            counts.set(link.type, existing + 1);
        }
    }

    return counts;
}