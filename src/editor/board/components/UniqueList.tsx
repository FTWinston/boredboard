import React from 'react';
import { UniqueTextBox } from './UniqueTextBox';

interface Props {
    values: string[];
    changeValue: (oldValue: string, newValue: string) => void;
    addValue: (value: string) => void;
}

export const UniqueList: React.FunctionComponent<Props> = props => {
    const existingValues = props.values.map((value, i) => (
        <UniqueTextBox
            key={value}
            disallowedValues={props.values}
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
            disallowedValues={props.values}
            initialValue=""
            placeholder="add new..."
            finishedEditing={addValue}
        />
        <UniqueTextBox
            hidden={true}
            key={props.values.length+1}
            disallowedValues={props.values}
            initialValue=""
            finishedEditing={() => {}}
        />
    </>
}