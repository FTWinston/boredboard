import React, { useContext, useState } from 'react';
import { Link } from 'react-router-dom';
import './ImageSelector.css';
import { PieceDispatch } from '../PieceEditor';
import svg from '../../../examples/chess/board.svg';

interface Props {
    initialUrl?: string;
    nextPage: string;
}

export const ImageSelector: React.FunctionComponent<Props> = props => {
    const context = useContext(PieceDispatch);

    const [url, setUrl] = useState(props.initialUrl === undefined ? /*''*/svg : props.initialUrl);

    return (
        <div className="boardEditor">
            <div className="boardEditor__board">
                <input  type="text" value={url} onChange={e => setUrl(e.target.value)} />
                Select or upload image. This textbox is a cheeky placeholder.
            </div>

            <div className="boardEditor__content">
                Need to disable the following link if no (valid) image url is present.
            </div>

            <div className="boardEditor__navigation">
                <Link to={props.nextPage} onClick={() => context({ type: 'set sole image', url })}>Continue</Link>
            </div>
        </div>
    );
}