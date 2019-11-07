import React, { useReducer, createContext, Dispatch, useMemo } from 'react';
import { Route, Switch, Redirect, Link, useRouteMatch } from 'react-router-dom';
import { IGameDefinition } from '../data/IGameDefinition';
import './GameEditor.css';
import { reducer, getInitialState, GameAction, getNewBoardID } from './gameReducer';
import { BoardEditor } from './board';
import { IBoardDefinition } from '../data/IBoardDefinition';

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
                <Route path={`${path}board/:id`}>
                    <BoardEditor
                        numPlayers={props.numPlayers}
                        getInitialData={getBoard}
                        saveData={saveBoard}
                    />
                </Route>
                <Route path={`${path}`} exact>
                    <div>
                        Game summary here. List of boards, pieces, rules.
                        For now <Link to={`${url}board/${getNewBoardID(state.boards)}`}>go edit a board</Link>.
                    </div>
                </Route> 
                <Route>
                    <Redirect to={url} />
                </Route>
            </Switch>
        </GameDispatch.Provider>
    );
}