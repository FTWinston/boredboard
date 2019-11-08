import React, { useMemo } from 'react';
import './Selector.css';

interface Props {
    className?: string;
    prefixText?: string;
    options: ReadonlySet<string> | ReadonlyArray<string>;
    selectedValues: ReadonlySet<string>;
    changeValue: (value: string, selected: boolean) => void;
}

export const SelectorMulti: React.FunctionComponent<Props> = props => {
    const { options, selectedValues, changeValue } = props;

    const linkTypeSelectors = useMemo(
        () => [...options].map(option => {
            const selected = selectedValues.has(option);

            const classes = selected
                ? 'selector__value selector__value--selected'
                : 'selector__value';

            return (
                <label key={option} className={classes}>
                    <input
                        type="checkbox"
                        checked={selected}
                        onChange={e => changeValue(option, e.target.checked)}
                    />
                    {option}
                </label>
            );
        }),
        [options, selectedValues, changeValue]
    );

    const classes = props.className === undefined
        ? 'selector selector--multi'
        : props.className + ' selector selector--multi';

    return (
        <p className={classes}>
            {props.prefixText} 
            {linkTypeSelectors}
        </p>
    );
}