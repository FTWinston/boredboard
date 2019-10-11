import React, { useMemo } from 'react';

interface Props {
    className?: string;
    linkTypes: string[];
    selectedLinkType: string;
    selectLinkType: (type: string) => void;
    undoAdd: () => void;
    linkFrom: string | null;
    linkedTo: string | null;
}

export const SingleLinkSetup: React.FunctionComponent<Props> = props => {
    const { linkTypes, selectedLinkType, selectLinkType, linkFrom, linkedTo, undoAdd } = props;

    const linkTypeSelectors = useMemo(
        () => linkTypes.map(type => {
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
                        onChange={() => selectLinkType(type)}
                    />
                </label>
            );
        }),
        [linkTypes, selectedLinkType, selectLinkType]
    );

    const stateDescription = useMemo(() => {
        if (props.linkFrom === null) {
            return <p>&nbsp;</p>
        }

        if (props.linkedTo === null) {
            return <p>Creating link from {props.linkFrom}...</p>
        }

        return <p>Created link from {props.linkFrom} to {props.linkedTo}.</p>
    }, [props.linkFrom, props.linkedTo]);

    const undoButton = useMemo(() => {
        if (linkedTo === null || linkFrom === null) {
            return undefined;
        }

        return (
            <button onClick={() => undoAdd()}>
                remove this link
            </button>
        );
    }, [linkFrom, linkedTo, undoAdd]);

    return (
        <div className={props.className}>
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

            {stateDescription}

            {undoButton}
        </div>
    );
}