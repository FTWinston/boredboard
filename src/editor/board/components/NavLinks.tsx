import React from 'react';
import { Link } from 'react-router-dom';

interface Props {
    prevPage?: string;
    nextPage?: string;
    summaryPage?: string;
    nextClicked?: () => void;
    disableMessage?: string;
}

export const NavLinks: React.FunctionComponent<Props> = props => {
    const prevLink = props.prevPage === undefined
        ? undefined
        : <Link to={props.prevPage}>Previous step</Link>

    const summaryLink = props.summaryPage === undefined
        ? undefined
        : props.disableMessage === undefined
            ? <Link to={props.summaryPage}>Show summary</Link>
            : <div title={props.disableMessage}>Show summary</div>

    const nextLink = props.nextPage === undefined
        ? undefined
        : props.disableMessage === undefined
            ? <Link to={props.nextPage} onClick={props.nextClicked}>Next step</Link>
            : <div title={props.disableMessage}>Next step</div>

    return (
        <div className="boardEditor__navigation">
            {prevLink}
            {summaryLink}
            {nextLink}
        </div>
    )
}