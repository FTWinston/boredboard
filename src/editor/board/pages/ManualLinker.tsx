import React, { useContext, useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import './ManualLinker.css';
import { BoardDisplay } from '../../../components/board';
import { BoardDispatch } from '../BoardEditor';
import { ILink } from '../boardReducer';
import { LinkTypes } from './LinkTypes';

interface Props {
    boardUrl: string;
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
            return undefined;
        }

        if (linkedTo === null) {
            return <p>Creating link from {linkFrom}...</p>
        }

        return <p>Created link from {linkFrom} to {linkedTo}.</p>
    }, [linkFrom, linkedTo]);

    const undoDisplay = useMemo(() => {
        if (linkedTo === null || linkFrom === null) {
            return undefined;
        }

        return (
            <button onClick={() => {
                context({
                    type: 'remove link',
                    fromCell: linkFrom,
                    toCell: linkedTo,
                    linkType: selectedLinkType,
                });
                setLinkFrom(null);
                setLinkedTo(null);
            }}>
                remove this link
            </button>
        );
    }, [linkFrom, linkedTo, selectedLinkType])

    return (
        <div className="boardEditor manualLinker">
            <BoardDisplay
                className="boardEditor__board"
                filePath={props.boardUrl}
            />
            
            <div className="boardEditor__content">
                <p>
                    To add single links, first select a link type, then click on a cell to start creating a link <em>from</em> that cell,
                    then click another to create a link <em>to</em> that cell. Click the "from" cell again to cancel.
                </p>

                <div className="manualLinker__columns">
                    <div className="manualLinker__createLink">
                        <div className="boardEditor__listTitle">Create links</div>

                        <p>
                            Select a link type, then click a cell to link from, then a cell to link to.
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