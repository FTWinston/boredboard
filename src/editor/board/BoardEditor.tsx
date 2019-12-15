import React, { useReducer, createContext, Dispatch, useState } from 'react';
import { Route, Switch, Redirect, RouteComponentProps, withRouter } from 'react-router-dom';
import { IBoardDefinition } from '../../data/IBoardDefinition';
import './BoardEditor.css';
import { reducer, getInitialState, BoardAction } from './boardReducer';
import { ImageSelector } from './pages/ImageSelector';
import { CellSelector } from './pages/CellSelector';
import { BulkLinker } from './pages/BulkLinker';
import { RegionCreator } from './pages/RegionCreator';
import BoardSummary from './pages/BoardSummary';
import { LinkTypes } from './pages/LinkTypes';
import { ManualLinker } from './pages/ManualLinker';
import { RelativeLinks } from './pages/RelativeLinks';
import { LinkGroups } from './pages/LinkGroups';
import { PlayerLinks } from './pages/PlayerLinks';
import { writeBoardFromState } from './writeBoardFromState';

interface Match {
    id?: string;
}

interface Props extends RouteComponentProps<Match>{
    numPlayers: number;
    getInitialData: (id?: string) => IBoardDefinition | undefined;
    saveData: (id: string | undefined, board: IBoardDefinition, isValid: boolean) => void;
    close: () => void;
}

export const BoardDispatch = createContext<Dispatch<BoardAction>>(ignore => {});

const BoardEditor: React.FunctionComponent<Props> = props => {
    const [state, dispatch] = useReducer(reducer, getInitialState(props.getInitialData(props.match.params.id)));
    
    const { path, url } = props.match;

    const [hasSeenSummary, setHasSeenSummary] = useState(false);

    return (
        <BoardDispatch.Provider value={dispatch}>
            <Switch>
                <Route path={`${path}/image`}>
                    <ImageSelector
                        initialUrl={state.imageUrl === '' ? undefined : state.imageUrl}
                        nextPage={`${url}/cells`}
                        summaryPage={hasSeenSummary ? url : undefined}
                    />
                </Route>
                <Route path={`${path}/cells`}>
                    <CellSelector
                        boardUrl={state.imageUrl}
                        cells={state.cells}
                        prevPage={`${url}/image`}
                        nextPage={`${url}/linktypes`}
                        summaryPage={hasSeenSummary ? url : undefined}
                    />
                </Route>
                <Route path={`${path}/linktypes`}>
                    <LinkTypes
                        boardUrl={state.imageUrl}
                        cells={state.cells}
                        linkTypes={state.linkTypes}
                        relativeLinkTypes={state.relativeLinkTypes}
                        playerLinkTypes={state.playerLinkTypes}
                        prevPage={`${url}/cells`}
                        nextPage={`${url}/bulklinks`}
                        summaryPage={hasSeenSummary ? url : undefined}
                    />
                </Route>
                <Route path={`${path}/bulklinks`}>
                    <BulkLinker
                        boardUrl={state.imageUrl}
                        cells={state.cells}
                        linkTypes={state.linkTypes}
                        links={state.links}
                        prevPage={`${url}/linktypes`}
                        nextPage={`${url}/manuallinks`}
                        summaryPage={hasSeenSummary ? url : undefined}
                    />
                </Route>
                <Route path={`${path}/manuallinks`}>
                    <ManualLinker
                        boardUrl={state.imageUrl}
                        cells={state.cells}
                        linkTypes={state.linkTypes}
                        links={state.links}
                        prevPage={`${url}/bulklinks`}
                        nextPage={state.linkTypes.length <= 1 ? `${url}/regions` : `${url}/directions`}
                        summaryPage={hasSeenSummary ? url : undefined}
                    />
                </Route>
                <Route path={`${path}/directions`}>
                    <RelativeLinks
                        linkTypes={state.linkTypes}
                        relativeLinkTypes={state.relativeLinkTypes}
                        relativeLinks={state.relativeLinks}
                        playerLinkTypes={state.playerLinkTypes}
                        prevPage={`${url}/manuallinks`}
                        nextPage={`${url}/playerdirections`}
                        summaryPage={hasSeenSummary ? url : undefined}
                    />
                </Route>
                <Route path={`${path}/playerdirections`}>
                    <PlayerLinks
                        linkTypes={state.linkTypes}
                        relativeLinkTypes={state.relativeLinkTypes}
                        playerLinkTypes={state.playerLinkTypes}
                        playerLinks={state.playerLinks}
                        numPlayers={props.numPlayers}
                        prevPage={`${url}/directions`}
                        nextPage={`${url}/directiongroups`}
                        summaryPage={hasSeenSummary ? url : undefined}
                    />
                </Route>
                <Route path={`${path}/directiongroups`}>
                    <LinkGroups
                        linkTypes={state.linkTypes}
                        relativeLinkTypes={state.relativeLinkTypes}
                        playerLinkTypes={state.playerLinkTypes}
                        linkGroupTypes={state.linkGroupTypes}
                        linkGroupItems={state.linkGroupItems}
                        prevPage={`${url}/playerdirections`}
                        nextPage={`${url}/regions`}
                        summaryPage={hasSeenSummary ? url : undefined}
                    />
                </Route>
                <Route path={`${path}/regions`}>
                    <RegionCreator
                        boardUrl={state.imageUrl}
                        cells={state.cells}
                        regionCells={state.regionCells}
                        numPlayers={props.numPlayers}
                        prevPage={`${url}/directiongroups`}
                        summaryPage={url}
                    />
                </Route>
                <Route exact render={() => {
                    if (state.imageUrl === '') {
                        return <Redirect to={`${url}/image`} />
                    }

                    setHasSeenSummary(true);
                    return (
                        <BoardSummary
                            boardUrl={state.imageUrl}
                            cells={state.cells}
                            linkTypes={state.linkTypes}
                            links={state.links}
                            regionCells={state.regionCells}
                            saveData={() => { props.saveData(props.match.params.id, writeBoardFromState(state), false /* TODO: validate */); props.close(); }}
                            discard={props.close}
                        />
                    );
                }} />
                <Route>
                    <Redirect to={url} />
                </Route>
            </Switch>
        </BoardDispatch.Provider>
    );
}

export default withRouter(BoardEditor);