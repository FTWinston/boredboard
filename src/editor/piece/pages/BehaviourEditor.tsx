import React, { useContext, useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { ConfigTextArea } from 'natural-configuration-ui';
import './BehaviourEditor.css';
import { PieceDispatch } from '../PieceEditor';
import { GameDefinition } from '../../../functionality/definitions';
import { parsePieceActions, getExamplePieceActions } from '../../../functionality/definitions/loading/parsePieceActions';
import { IParserError } from 'natural-configuration';
import { getAllDirections } from '../../../functionality/instances/functions/getAllLinkTypes';

interface Props {
    game: GameDefinition;
    behaviour: string;
    nextPage: string;
    prevPage: string;
}

export const BehaviourEditor: React.FunctionComponent<Props> = props => {
    const context = useContext(PieceDispatch);

    const [text, setText] = useState(props.behaviour);

    const errors = useMemo(() => {
        const directions = getAllDirections(props.game);
        const result = parsePieceActions(props.game, text, directions)
        
        return result.success
            ? []
            : result.errors;
    }, [props.game, text]);
    
    const [highlightedError, setHighlightedError] = useState(undefined as IParserError | undefined);

    const errorDisplay = errors.length === 0
        ? undefined
        : (
        <ol className="behaviourEditor__errors">
            {errors.map((e, i) => {
                    const classes = e === highlightedError
                        ? 'behaviourEditor__error behaviourEditor__error--selected'
                        : 'behaviourEditor__error'
                    
                    const clicked = () => setHighlightedError(e === highlightedError ? undefined : e);

                    return <li key={i} className={classes} onClick={clicked}>{e.message}</li>
                }
            )}
        </ol>
    );

    return (
        <div className="pieceEditor behaviourEditor">
            <p>Control how piece behaves</p>

            <ConfigTextArea
                className="behaviourEditor__text"
                text={text}
                onChange={t => setText(t)}
                errors={errors}
                highlightedError={highlightedError}
                onEnterError={err => setHighlightedError(err)}
            />

            {errorDisplay}

            <div className="behaviourEditor__examples">
                <div className="behaviourEditor__sectionHeading">Example behaviour (click to append)</div>

                <ul className="behaviourEditor__exampleList">
                    {getExamplePieceActions().map((ex, i) => (
                        <li
                            key={i}
                            className="behaviourEditor__example"
                            onClick={() => setText(text.trim().length === 0 ? `${ex}.` : `${text} ${ex}.`)}
                        >{ex}.</li>
                    ))}
                </ul>
            </div>

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