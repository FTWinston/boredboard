import React, { useMemo } from 'react';
import { SelectorSingle } from './SelectorSingle';

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
    const { linkFrom, linkedTo, undoAdd } = props;

    const stateDescription = useMemo(() => {
        if (props.linkFrom === null) {
            return <p>&nbsp;</p>
        }

        if (props.linkedTo === null) {
            return <p>Creating link from {props.linkFrom}...</p>
        }

        return <p>Created link from {props.linkFrom} to {props.linkedTo}.</p>
    }, [props.linkFrom, props.linkedTo]);

    const linkTypeSelector = props.linkTypes.length <= 2
        ? undefined
        : <SelectorSingle
            prefixText="Link type:"
            radioGroup="linkType"
            options={props.linkTypes}
            selectedValue={props.selectedLinkType}
            selectValue={props.selectLinkType}
        />

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
            <div className="boardEditor__listTitle">Create a link</div>

            <p>
                {props.linkTypes.length <= 1 ? 'Click' : 'Select a link type, then click'} a cell to link <em>from</em>, then a cell to link <em>to</em>.
            </p>

            <p>
                You can click the <em>from</em> cell again to cancel, and you can easily undo the last link added.
            </p>

            {linkTypeSelector}

            {stateDescription}

            {undoButton}
        </div>
    );
}