import React, { useReducer, createContext, Dispatch } from 'react';
import { Route, Switch, Redirect } from 'react-router-dom';
import { IBoard } from '../../data/IBoard';
import './BoardEditor.css';
import { reducer, getInitialState, BoardAction, saveBoardData } from './boardReducer';
import { ImageSelector } from './pages/ImageSelector';
import { CellSelector } from './pages/CellSelector';
import { BulkLinker } from './pages/BulkLinker';
import { RegionCreator } from './pages/RegionCreator';
import { BoardSummary } from './pages/BoardSummary';
import { LinkTypes } from './pages/LinkTypes';
import { ManualLinker } from './pages/ManualLinker';

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
                <Route path="/linktypes">
                    <LinkTypes
                        boardUrl={state.imageUrl}
                        cells={state.cells}
                        linkTypes={state.linkTypes}
                    />
                </Route>
                <Route path="/bulklinks">
                    <BulkLinker
                        boardUrl={state.imageUrl}
                        cells={state.cells}
                        linkTypes={state.linkTypes}
                        links={state.links}
                    />
                </Route>
                <Route path="/manuallinks">
                    <ManualLinker
                        boardUrl={state.imageUrl}
                        cells={state.cells}
                        linkTypes={state.linkTypes}
                        links={state.links}
                    />
                </Route>
                <Route path="/regions">
                    <RegionCreator
                        boardUrl={state.imageUrl}
                        cells={state.cells}
                    />
                </Route>
                <Route render={() => {
                    if (state.imageUrl === '') {
                        return <Redirect to="/image" />
                    }
                    return (
                        <BoardSummary
                            boardUrl={state.imageUrl}
                            cells={state.cells}
                            links={state.links}
                            regions={state.regions}
                            saveData={() => props.saveData(saveBoardData(state))}
                        />
                    );
                }} />
            </Switch>
        </BoardDispatch.Provider>
    );
}