import React, { useContext, useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import './ManualLinker.css';
import { BoardDisplay } from '../../../components/board';
import { BoardDispatch } from '../BoardEditor';
import { ILink } from '../boardReducer';
import { LinkTypes } from './LinkTypes';

interface Props {
    boardUrl: string;
    cells: string[];
    linkTypes: string[];
    links: ILink[];
}

export const ManualLinker: React.FunctionComponent<Props> = props => {
    const context = useContext(BoardDispatch);

    const [selectedLinkType, setSelectedLinkType] = useState(props.linkTypes[0]);

    const [linkFrom, setLinkFrom] = useState(null as string | null);

    const [linkedTo, setLinkedTo] = useState(null as string | null);

    const linkTypeSelectors = useMemo(
        () => props.linkTypes.map(type => {
            const selected = type === selectedLinkType;

            const classes = selected
                ? 'manualLinker__linkType manualLinker__linkType--selected'
                : 'manualLinker__linkType'

            return (
                <label key={type} className={classes}>
                    {type}
                    <input
                        type="radio"
                        radioGroup="linkType"
                        checked={selected}
                        onChange={() => {
                            setSelectedLinkType(type);
                            
                            // Changing link type makes it unclear what you would undo,
                            // so remove the ability to undo.
                            if (linkedTo !== null) {
                                setLinkFrom(null);
                                setLinkedTo(null);
                            }
                        }}
                    />
                </label>
            );
        }),
        [props.linkTypes, selectedLinkType]
    );

    const createCellsDisplay = useMemo(() => {
        if (linkFrom === null) {
            return <p>&nbsp;</p>
        }

        if (linkedTo === null) {
            return <p>Creating link from {linkFrom}...</p>
        }

        return <p>Created link from {linkFrom} to {linkedTo}.</p>
    }, [linkFrom, linkedTo]);

    const undoDisplay = useMemo(() => {
        const disabled = linkedTo === null || linkFrom === null;

        const clicked = disabled
            ? undefined
            : () => {
                context({
                    type: 'remove link',
                    fromCell: linkFrom!,
                    toCell: linkedTo!,
                    linkType: selectedLinkType,
                });
                setLinkFrom(null);
                setLinkedTo(null);
            };

        return (
            <button onClick={clicked} disabled={disabled}>
                remove this link
            </button>
        );
    }, [linkFrom, linkedTo, selectedLinkType])

    const existingLinkDisplays = useMemo(() => props.links.map((link, i) => (
        <div
            className="manualLinker__link"
            key={i}
            onClick={() => context({
                type: 'remove link',
                fromCell: link.fromCell,
                toCell: link.toCell,
                linkType: link.type,
            })}
        >
            {link.type} from {link.fromCell} to {link.toCell}
        </div>
    )), [props.links]);

    return (
        <div className="boardEditor manualLinker">
            <BoardDisplay
                className="boardEditor__board"
                filePath={props.boardUrl}
                cells={props.cells}
                selectableCells={linkFrom === null ? undefined : [linkFrom]}
                moveableCells={linkedTo === null ? undefined : [linkedTo]}
                cellClicked={cell => {
                    if (linkFrom === null || linkedTo !== null) {
                        setLinkFrom(cell);
                        setLinkedTo(null);
                        return;
                    }

                    if (cell === linkFrom) {
                        setLinkFrom(null);
                        setLinkedTo(null);
                        return;
                    }

                    // TODO: if there's already a link with the same from / to / type,
                    // don't add a new one. But also make it clear that this is the case.

                    setLinkedTo(cell);

                    context({
                        type: 'add link',
                        fromCell: linkFrom,
                        toCell: cell,
                        linkType: selectedLinkType,
                    });
                }}
            />
            
            <div className="boardEditor__content">
                <p>
                    You can link individual pairs of cells here, or remove specific links.
                </p>

                <div className="manualLinker__columns">
                    <div className="manualLinker__createLink">
                        <div className="boardEditor__listTitle">Create links</div>

                        <p>
                            Select a link type, then click a cell to link <em>from</em>, then a cell to link <em>to</em>.
                        </p>

                        <p>
                            You can click the <em>from</em> cell again to cancel, and you can easily undo the last link added.
                        </p>

                        <p>
                            Link type: 
                            {linkTypeSelectors}
                        </p>

                        {createCellsDisplay}

                        {undoDisplay}
                    </div>

                    <div className="manualLinker__existingLinks">
                        <div className="boardEditor__listTitle">Remove links</div>
                        <p>Click an existing link to remove it.</p>

                        {existingLinkDisplays}
                    </div>
                </div>
            </div>

            <div className="boardEditor__navigation">
                <Link to="/bulklinks">Back</Link>
                <Link to="/regions">Continue</Link>
            </div>
        </div>
    );
}