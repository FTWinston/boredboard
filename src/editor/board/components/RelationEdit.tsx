import React from 'react';
import './RelationEdit.css';

interface Props {
    className?: string;
    fromLinkType: string;
    toLinkType: string;
    relationType: string;
    relationTypes: string[];
    linkTypes: string[];
    edit: (fromType: string, toType: string, relationType: string) => void;
}

export const RelationEdit: React.FunctionComponent<Props> = props => {
    const classes = props.className === undefined
        ? 'relationEdit'
        : props.className + ' relationEdit';

    return (
        <div className={classes}>
            [RELATION TYPE] from [FROM LINK TYPE] is [TO LINK TYPE]
        </div>
    );
}