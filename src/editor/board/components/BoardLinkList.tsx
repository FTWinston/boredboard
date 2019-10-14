import React, { useContext, useState, useMemo } from 'react';
import { BoardDispatch } from '../BoardEditor';
import { ILink } from '../boardReducer';

interface Props {
    className?: string;
    links: ILink[];
    linkTypes: string[];
}

export const BoardLinkList: React.FunctionComponent<Props> = props => {
    const context = useContext(BoardDispatch);

    const [lastRemoved, setLastRemoved] = useState(null as ILink | null);

    const existingLinkDisplays = useMemo(() => props.links.map((link, i) => (
        <div
            className="manualLinker__link"
            key={i}
            onClick={() => {
                setLastRemoved(link);

                context({
                    type: 'remove link',
                    fromCell: link.fromCell,
                    toCell: link.toCell,
                    linkType: link.type,
                });
            }}
        >
            {props.linkTypes.length <= 1 ? 'Link' : link.type} from {link.fromCell} to {link.toCell}
        </div>
    )), [props.links, props.linkTypes, context]);

    const undoButton = useMemo(() => {
        if (lastRemoved === null) {
            return undefined;
        }

        return (
            <button onClick={() => {
                context({
                    type: 'add link',
                    fromCell: lastRemoved.fromCell,
                    toCell: lastRemoved.toCell,
                    linkType: lastRemoved.type,
                });
                
                setLastRemoved(null);
            }}>
                restore removed link
            </button>
        );
    }, [lastRemoved, context]);

    return (
        <div className={props.className}>
            <div className="boardEditor__listTitle">Existing links</div>
            <p>Click an existing link to remove it.</p>

            <div className="manualLinker__existingLinkList">
                {existingLinkDisplays}
            </div>

            {undoButton}
        </div>
    );
}