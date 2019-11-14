import React, { useContext, useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { ConfigTextArea,  } from 'natural-configuration-ui';
import './BehaviourEditor.css';
import { PieceDispatch } from '../PieceEditor';
import { IParserError } from 'natural-configuration';

interface Props {
    behaviour: string;
    nextPage: string;
    prevPage: string;
}

export const BehaviourEditor: React.FunctionComponent<Props> = props => {
    const context = useContext(PieceDispatch);

    const [text, setText] = useState(props.behaviour);

    const errors = useMemo(() => {
        // TODO: parse behaviour text and find any errors
        return [] as IParserError[];
    }, [text]);
    
    return (
        <div className="pieceEditor behaviourEditor">
            <p>Control how piece behaves</p>

            <ConfigTextArea
                className="behaviourEditor__text"
                text={text}
                onChange={t => setText(t)}
                errors={errors}
            />

            <div className="boardEditor__navigation">
                <Link to={props.prevPage}>Back</Link>
                <Link
                    to={props.nextPage}
                    onClick={() => context({ type: 'set behaviour', behaviour: text })}
                >
                    Continue
                </Link>
            </div>
        </div>
    );
}