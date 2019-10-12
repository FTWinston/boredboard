import React from 'react';
import './SelectAllNone.css'

interface Props {
    className?: string;
    selectAll?: () => void;
    selectNone?: () => void;
}

export const SelectAllNone: React.FunctionComponent<Props> = props => {
    const classes = props.className === undefined
        ? 'selectAllNone'
        : props.className + ' selectAllNone';

    return (
        <div className={classes}>
            <button disabled={props.selectAll === undefined} onClick={props.selectAll}>select all</button>
            <button disabled={props.selectNone === undefined} onClick={props.selectNone}>select none</button>
        </div>
    )
}