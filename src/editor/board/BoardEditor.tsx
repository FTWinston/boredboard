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
import { RelativeLinks } from './pages/RelativeLinks';
import { LinkGroups } from './pages/LinkGroups';
import { PlayerLinks } from './pages/PlayerLinks';

interface Props {
    name: string;
    numPlayers: number;
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
                        nextPage="/cells"
                    />
                </Route>
                <Route path="/cells">
                    <CellSelector
                        boardUrl={state.imageUrl}
                        cells={state.cells}
                        prevPage="/image"
                        nextPage="/linktypes"
                    />
                </Route>
                <Route path="/linktypes">
                    <LinkTypes
                        boardUrl={state.imageUrl}
                        cells={state.cells}
                        linkTypes={state.linkTypes}
                        relativeLinkTypes={state.relativeLinkTypes}
                        playerLinkTypes={state.playerLinkTypes}
                        prevPage="/cells"
                        nextPage="/bulklinks"
                    />
                </Route>
                <Route path="/bulklinks">
                    <BulkLinker
                        boardUrl={state.imageUrl}
                        cells={state.cells}
                        linkTypes={state.linkTypes}
                        links={state.links}
                        prevPage="/linktypes"
                        nextPage="/manuallinks"
                    />
                </Route>
                <Route path="/manuallinks">
                    <ManualLinker
                        boardUrl={state.imageUrl}
                        cells={state.cells}
                        linkTypes={state.linkTypes}
                        links={state.links}
                        prevPage="/bulklinks"
                        nextPage={state.linkTypes.length <= 1 ? '/regions' : '/directions'}
                    />
                </Route>
                <Route path="/directions">
                    <RelativeLinks
                        linkTypes={state.linkTypes}
                        relativeLinkTypes={state.relativeLinkTypes}
                        relativeLinks={state.relativeLinks}
                        playerLinkTypes={state.playerLinkTypes}
                        prevPage="/manuallinks"
                        nextPage="/playerdirections"
                    />
                </Route>
                <Route path="/playerdirections">
                    <PlayerLinks
                        boardUrl={state.imageUrl}
                        cells={state.cells}
                        linkTypes={state.linkTypes}
                        numPlayers={props.numPlayers}
                        prevPage="/directions"
                        nextPage="/directiongroups"
                    />
                </Route>
                <Route path="/directiongroups">
                    <LinkGroups
                        boardUrl={state.imageUrl}
                        cells={state.cells}
                        linkTypes={state.linkTypes}
                        relativeLinkTypes={state.relativeLinkTypes}
                        prevPage="/playerdirections"
                        nextPage="/regions"
                    />
                </Route>
                <Route path="/regions">
                    <RegionCreator
                        boardUrl={state.imageUrl}
                        cells={state.cells}
                        numPlayers={props.numPlayers}
                        prevPage="/directiongroups"
                        nextPage="/"
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
                            linkTypes={state.linkTypes}
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