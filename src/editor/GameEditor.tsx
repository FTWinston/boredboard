import React, { useReducer, createContext, Dispatch, useMemo } from 'react';
import { Route, Switch, Redirect, useRouteMatch } from 'react-router-dom';
import { IGameDefinition } from '../data/IGameDefinition';
import { reducer, getInitialState, GameAction } from './gameReducer';
import { BoardEditor } from './board';
import { IBoardDefinition } from '../data/IBoardDefinition';
import { EditorSummary } from './summary';
import { IPieceDefinition } from '../data/IPieceDefinition';
import { PieceEditor } from './piece';
import { GameDefinition } from '../functionality/definitions';
import { writeGameFromState } from './writeGameFromState';

interface Props {
    name: string;
    numPlayers: number;
    initialData?: IGameDefinition;
    saveData: (game: IGameDefinition) => void;
}

export const GameDispatch = createContext<Dispatch<GameAction>>(ignore => {});

export const GameEditor: React.FunctionComponent<Props> = props => {
    const [state, dispatch] = useReducer(reducer, getInitialState(props.initialData));

    const saveBoard = useMemo(() => {
        return (id: string | undefined, board: IBoardDefinition) => dispatch(id === 'new' || id === undefined
            ? {
                type: 'add board',
                board,
            }
            : {
                type: 'set board',
                board: {
                    id: id,
                    ...board,
                },
            }
        );
    }, [dispatch]);

    const getBoard = useMemo(() => {
        return (id: string | undefined) => id === undefined ? undefined : state.boards.find(b => b.id === id);
    }, [state.boards])

    const savePiece = useMemo(() => {
        return (id: string | undefined, piece: IPieceDefinition) => dispatch(id === 'new' || id === undefined
            ? {
                type: 'add piece',
                piece,
            }
            : {
                type: 'set piece',
                piece: {
                    id: id,
                    ...piece,
                },
            }
        );
    }, [dispatch]);

    const getPiece = useMemo(() => {
        return (id: string | undefined) => id === undefined ? undefined : state.pieces.find(p => p.id === id);
    }, [state.pieces])

    const { path, url } = useRouteMatch()!;

    const game = useMemo(
        () => new GameDefinition(writeGameFromState(state)),
        [state]
    );
    
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
                <Route path={`${path}/piece/:id`}>
                    <PieceEditor
                        game={game}
                        numPlayers={props.numPlayers}
                        getInitialData={getPiece}
                        saveData={savePiece}
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