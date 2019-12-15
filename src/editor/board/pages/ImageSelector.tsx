import React, { useContext, useState } from 'react';
import './ImageSelector.css';
import { BoardDispatch } from '../BoardEditor';
import svg from '../../../examples/chess/board.svg';
import { NavLinks } from '../components/NavLinks';

interface Props {
    initialUrl?: string;
    prevPage?: string;
    nextPage?: string;
    summaryPage?: string;
}

export const ImageSelector: React.FunctionComponent<Props> = props => {
    const context = useContext(BoardDispatch);

    const [url, setUrl] = useState(props.initialUrl === undefined ? /*''*/svg : props.initialUrl);

    return (
        <div className="boardEditor">
            <div className="boardEditor__board">
                <input  type="text" value={url} onChange={e => setUrl(e.target.value)} />
                Select or upload image. This textbox is a cheeky placeholder.
            </div>

            <div className="boardEditor__content">
                <p>
                    The board image is an SVG, and the elements of this SVG that represent cells must have IDs on them.
                </p>
                <p>
                    To allow users to your board using their custom colors, instead of specifying fill or stroke styles yourself, give elements the following attributes:
                    <ul>
                        <li><strong>data-fill</strong>: <em>light</em>, <em>mid</em> or <em>dark</em></li>
                        <li><strong>data-stroke</strong>: <em>light</em>, <em>mid</em> or <em>dark</em></li>
                    </ul>
                </p>
            </div>

            <NavLinks
                prevPage={props.prevPage}
                nextPage={props.nextPage}
                nextClicked={() => context({ type: 'set image', url })}
                disableMessage={url === undefined || url.trim().length === 0 ? 'You must specify an image to continue' : undefined}
                summaryPage={props.summaryPage}
            />
        </div>
    );
}