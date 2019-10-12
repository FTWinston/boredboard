import React, { useMemo } from 'react';
import './Selector.css';

interface Props {
    className?: string;
    prefixText?: string;
    radioGroup: string;
    options: string[];
    selectedValue: string;
    selectValue: (value: string) => void;
}

export const SelectorSingle: React.FunctionComponent<Props> = props => {
    const { options, selectedValue, selectValue, radioGroup } = props;

    const linkTypeSelectors = useMemo(
        () => options.map(option => {
            const selected = option === selectedValue;

            const classes = selected
                ? 'selector__value selector__value--selected'
                : 'selector__value';

            return (
                <label key={option} className={classes}>
                    <input
                        type="radio"
                        radioGroup={radioGroup}
                        checked={selected}
                        onChange={() => selectValue(option)}
                    />
                    {option}
                </label>
            );
        }),
        [options, selectedValue, selectValue, radioGroup]
    );

    const classes = props.className === undefined
        ? 'selector selector--single'
        : props.className + ' selector selector--single';

    return (
        <p className={classes}>
            {props.prefixText} 
            {linkTypeSelectors}
        </p>
    );
}