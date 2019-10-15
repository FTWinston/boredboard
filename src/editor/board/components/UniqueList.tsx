import React, { useMemo } from 'react';
import { UniqueTextBox } from './UniqueTextBox';

interface Props {
    values: string[];
    disallowedValues?: string[];
    changeValue: (oldValue: string, newValue: string) => void;
    addValue: (value: string) => void;
}

export const UniqueList: React.FunctionComponent<Props> = props => {
    const allDisallowed = useMemo(
        () => [
            ...props.values,
            ...props.disallowedValues === undefined
                ? []
                : props.disallowedValues,
        ],
        [props.values, props.disallowedValues]
    );

    const existingValues = props.values.map((value, i) => (
        <UniqueTextBox
            key={value}
            disallowedValues={allDisallowed}
            allowIndex={i}
            initialValue={value}
            finishedEditing={(val: string) => props.changeValue(value, val)}
        />
    ));

    const addValue = (val: string) => props.addValue(val);

    return <>
        {existingValues}
        <UniqueTextBox
            key={props.values.length}
            disallowedValues={allDisallowed}
            initialValue=""
            placeholder="add new..."
            finishedEditing={addValue}
        />
        <UniqueTextBox
            hidden={true}
            key={props.values.length+1}
            disallowedValues={allDisallowed}
            initialValue=""
            finishedEditing={() => {}}
        />
    </>
}