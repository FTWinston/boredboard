import React, { useReducer, createContext, Dispatch } from 'react';
import { Route, Switch, Redirect } from 'react-router-dom';
import { IBoard } from '../../data/IBoard';
import './BoardEditor.css';
import { reducer, getInitialState, BoardAction } from './boardReducer';
import { ImageSelector } from './pages/ImageSelector';
import { CellSelector } from './pages/CellSelector';
import { CellLinker } from './pages/CellLinker';
import { RegionCreator } from './pages/RegionCreator';
import { BoardSummary } from './pages/BoardSummary';

interface Props {
    name: string;
    initialData?: IBoard;
    saveData: (board: IBoard) => void;
}

export const BoardDispatch = createContext<Dispatch<BoardAction>>(ignore => {});

export const BoardEditor: React.FunctionComponent<Props> = props => {
    const [state, dispatch] = useReducer(reducer, getInitialState(props.initialData));

    return (
        <BoardDispatch.Provider value={dispatch}>
            <Switch>
                <Route path="/image">
                    <ImageSelector
                        initialUrl={state.imageUrl === '' ? undefined : state.imageUrl}
                    />
                </Route>
                <Route path="/cells">
                    <CellSelector
                        boardUrl={state.imageUrl}
                        cells={state.cells}
                    />
                </Route>
                <Route path="/links">
                    <CellLinker
                        boardUrl={state.imageUrl}
                    />
                </Route>
                <Route path="/regions">
                    <RegionCreator
                        boardUrl={state.imageUrl}
                    />
                </Route>
                <Route render={() => {
                    if (state.imageUrl === '') {
                        return <Redirect to="/image" />
                    }
                    return (
                        <BoardSummary
                            boardUrl={state.imageUrl}
                        />
                    );
                }} />
            </Switch>
        </BoardDispatch.Provider>
    );
}