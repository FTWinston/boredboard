import React, { useState, useMemo } from 'react';
import './UniqueTextBox.css';

interface Props {
    initialValue: string;
    className?: string;
    finishedEditing: (value: string) => void;
    disallowedValues: string[];
    allowIndex?: number;
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
            if (isValid) {
                return props.className
                    ? `${props.className} uniqueTextBox`
                    : `uniqueTextBox`;
            }
            else {
                return props.className
                    ? `${props.className} uniqueTextBox uniqueTextBox--invalid`
                    : `uniqueTextBox uniqueTextBox--invalid`;
            }
        },
        [props.className, isValid]
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