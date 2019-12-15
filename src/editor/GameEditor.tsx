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

    const closeBoard = useMemo(() => 
        () => { } // TODO: need to be able to close this somehow
        , []
    );

    const saveBoard = useMemo(() => {
        return (id: string | undefined, board: IBoardDefinition, isValid: boolean) => {
            dispatch(id === 'new' || id === undefined
                ? {
                    type: 'add board',
                    isValid,
                    board,
                }
                : {
                    type: 'set board',
                    id,
                    isValid,
                    board,
                }
            );

            closeBoard();
        };
    }, [dispatch, closeBoard]);


    const getBoard = useMemo(() => {
        return (id: string | undefined) => {
            if (id === undefined) {
                return undefined;
            }
            
            const board = state.boards.find(b => b.id === id);
            return board === undefined
                ? undefined
                : board.value;
        }
    }, [state.boards])

    const savePiece = useMemo(() => {
        return (id: string | undefined, piece: IPieceDefinition, isValid: boolean) => dispatch(id === 'new' || id === undefined
            ? {
                type: 'add piece',
                isValid,
                piece,
            }
            : {
                type: 'set piece',
                id,
                isValid,
                piece,
            }
        );
    }, [dispatch]);

    const getPiece = useMemo(() => {
        return (id: string | undefined) => {
            if (id === undefined) {
                return undefined;
            }
            
            const piece = state.pieces.find(p => p.id === id);
            return piece === undefined
                ? undefined
                : piece.value;
        }
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
                        close={closeBoard}
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