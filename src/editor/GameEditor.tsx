import React, { useReducer, createContext, Dispatch, useMemo } from 'react';
import { Route, Switch, Redirect, useRouteMatch } from 'react-router-dom';
import { IGameDefinition } from '../data/IGameDefinition';
import { reducer, getInitialState, GameAction } from './gameReducer';
import { BoardEditor } from './board';
import { IBoardDefinition } from '../data/IBoardDefinition';
import { EditorSummary } from './summary';

interface Props {
    name: string;
    numPlayers: number;
    initialData?: IGameDefinition;
    saveData: (game: IGameDefinition) => void;
}

export const GameDispatch = createContext<Dispatch<GameAction>>(ignore => {});

export const GameEditor: React.FunctionComponent<Props> = props => {
    const [state, dispatch] = useReducer(reducer, props.initialData === undefined ? getInitialState() : props.initialData);

    const saveBoard = useMemo(() => {
        return (id: string | undefined, board: IBoardDefinition) => dispatch(id === undefined
            ? {
                type: 'add board',
                board,
            }
            : {
                type: 'set board',
                id,
                board,
            }
        );
    }, [dispatch]);

    const getBoard = useMemo(() => {
        return (id: string | undefined) => id === undefined ? undefined : state.boards[id];
    }, [state.boards])

    let { path, url } = useRouteMatch()!;
    
    return (
        <GameDispatch.Provider value={dispatch}>
            <Switch>
                <Route path={`${path}/board/:id`}>
                    <BoardEditor
                        numPlayers={props.numPlayers}
                        getInitialData={getBoard}
                        saveData={saveBoard}
                    />
                </Route>
                <Route path={path} exact>
                    <EditorSummary
                        name={props.name}
                        boards={state.boards}
                        pieces={state.pieces}
                        rules={state.rules}
                    />
                </Route>
                <Route>
                    <Redirect to={url} />
                </Route>
            </Switch>
        </GameDispatch.Provider>
    );
}