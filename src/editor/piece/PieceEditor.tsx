import React, { useReducer, createContext, Dispatch } from 'react';
import { Route, Switch, Redirect, RouteComponentProps, withRouter } from 'react-router-dom';
import { IPieceDefinition } from '../../data/IPieceDefinition';
import './PieceEditor.css';
import { reducer, getInitialState, PieceAction } from './pieceReducer';
import { ImageSelector } from './pages/ImageSelector';
import PieceSummary from './pages/PieceSummary';
import { BehaviourEditor } from './pages/BehaviourEditor';
import { writePieceFromState } from './writePieceFromState';
import { GameDefinition } from '../../functionality/definitions/GameDefinition';

interface Match {
    id?: string;
}

interface Props extends RouteComponentProps<Match>{
    numPlayers: number;
    game: GameDefinition;
    getInitialData: (id?: string) => IPieceDefinition | undefined;
    saveData: (id: string | undefined, board: IPieceDefinition) => void;
}

export const PieceDispatch = createContext<Dispatch<PieceAction>>(ignore => {});

const PieceEditor: React.FunctionComponent<Props> = props => {
    const [state, dispatch] = useReducer(reducer, getInitialState(props.getInitialData(props.match.params.id)));
    
    const { path, url } = props.match;

    return (
        <PieceDispatch.Provider value={dispatch}>
            <Switch>
                <Route path={`${path}/image`}>
                    <ImageSelector
                        initialUrl={undefined}
                        nextPage={`${url}/cells`}
                    />
                </Route>
                <Route path={`${path}/behaviour`}>
                    <BehaviourEditor
                        behaviour={state.behaviour}
                        game={props.game}
                        prevPage={`${url}/image`}
                        nextPage={url}
                    />
                </Route>
                <Route exact render={() => {
                    if (state.images.length === 0) {
                        return <Redirect to={`${url}/image`} />
                    }
                    return (
                        <PieceSummary
                            images={state.images}
                            behaviour={state.behaviour}
                            saveData={() => props.saveData(props.match.params.id, writePieceFromState(state, props.numPlayers))}
                        />
                    );
                }} />
                <Route>
                    <Redirect to={url} />
                </Route>
            </Switch>
        </PieceDispatch.Provider>
    );
}

export default withRouter(PieceEditor);