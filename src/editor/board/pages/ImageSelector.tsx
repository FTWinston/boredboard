import React, { useContext, useState } from 'react';
import { Link } from 'react-router-dom';
import './ImageSelector.css';
import { BoardDispatch } from '../BoardEditor';
import svg from '../../../chessboard.svg';

interface Props {
    initialUrl?: string;
}

export const ImageSelector: React.FunctionComponent<Props> = props => {
    const context = useContext(BoardDispatch);

    const [url, setUrl] = useState(props.initialUrl === undefined ? /*''*/svg : props.initialUrl);

    return (
        <div className="boardEditor boardEditor--image">
            <input type="text" value={url} onChange={e => setUrl(e.target.value)} />
            Select or upload image. This textbox is a cheeky placeholder.

            Need to disable the following link if no (valid) image url is present.

            <Link to="/cells" onClick={() => context({ type: 'set image', url })}>Continue</Link>
        </div>
    );
}