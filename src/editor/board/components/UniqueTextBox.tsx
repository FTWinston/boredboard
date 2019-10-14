import React, { useState, useMemo } from 'react';
import './UniqueTextBox.css';

interface Props {
    initialValue: string;
    className?: string;
    finishedEditing: (value: string) => void;
    disallowedValues: string[];
    allowIndex?: number;
    hidden?: boolean;
}

export const UniqueTextBox: React.FunctionComponent<Props> = props => {
    const [text, setText] = useState(props.initialValue);

    const isValid = useMemo(
        () => {
            const matchIndex = props.disallowedValues.indexOf(text);
            return matchIndex === -1 || matchIndex === props.allowIndex;
        },
        [text, props.disallowedValues, props.allowIndex]
    );

    const classes = useMemo(
        () => {
            let classes = 'uniqueTextBox';

            if (props.hidden) {
                classes += ' uniqueTextBox--hidden';
            }

            if (!isValid) {
                classes += ' uniqueTextBox--invalid';
            }

            if (props.className) {
                classes = `${classes} ${props.className}`
            }

            return classes;
        },
        [props.className, isValid, props.hidden]
    );

    return (
        <input
            className={classes}
            type="text"
            value={text}
            onChange={e => setText(e.currentTarget.value)}
            onBlur={() => { if (isValid) { props.finishedEditing(text); } }}
        />
    )
}