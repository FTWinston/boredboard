import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import './BehaviourEditor.css';
import { PieceDispatch } from '../PieceEditor';

interface Props {
    behaviour: string;
    nextPage: string;
    prevPage: string;
}

export const BehaviourEditor: React.FunctionComponent<Props> = props => {
    const context = useContext(PieceDispatch);
    
    return (
        <div className="pieceEditor behaviourEditor">
            <p>Control how piece behaves</p>

            <div className="boardEditor__navigation">
                <Link to={props.prevPage}>Back</Link>
                <Link
                    to={props.nextPage}
                >
                    Continue
                </Link>
            </div>
        </div>
    );
    // onClick={() => { if (props.linkTypes.length === 0) { context({ type: 'set link types', linkTypes: [''] }); } }}
}