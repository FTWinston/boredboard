import React, { FunctionComponent, useMemo, useState } from 'react';
import './GameBoard.css';
import { IGameState } from '../functionality/instances/IGameState';
import { IGameDefinition } from '../data/IGameDefinition';
import { GameDefinition } from '../functionality/definitions/GameDefinition';
import { GameBoard } from './GameBoard';
import { IPlayerAction } from '../functionality/instances/IPlayerAction';
import { applyAction } from '../functionality/instances/functions/applyAction';
import { copyState } from '../functionality/instances/functions/copyState';

interface Props {
    definition: IGameDefinition;
    initialState: IGameState;
}

export const Game: FunctionComponent<Props> = props => {
    const currentPlayer = 1;

    const game = useMemo(
        () => new GameDefinition(props.definition),
        [props.definition]
    );

    const [state, setState] = useState(props.initialState);

    const boardState = useMemo(
        () => state.boards['board']!,
        [state.boards]
    );

    const possibleMoves = useMemo(
        () => game.getPossibleActions(currentPlayer, state)
        , [currentPlayer, state, game]
    );

    const selectAction = useMemo(
        () => {
            return (action: IPlayerAction) => {
                const newState = copyState(state);
                if (applyAction(action, newState)) {
                    setState(newState);
                }
            };
        },
        [state]
    );

    return <GameBoard
        game={game}
        state={boardState}
        possibleMoves={possibleMoves}
        selectAction={selectAction}
    />
}