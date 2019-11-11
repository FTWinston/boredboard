import React, { FunctionComponent, useMemo } from 'react';
import './GameBoard.css';
import { IGameState } from '../functionality/instances/IGameState';
import { IGameDefinition } from '../data/IGameDefinition';
import { GameDefinition } from '../functionality/definitions/GameDefinition';
import { GameBoard } from './GameBoard';

interface Props {
    definition: IGameDefinition;
    state: IGameState;
}

export const Game: FunctionComponent<Props> = props => {
    const currentPlayer = 1;

    const game = useMemo(() => new GameDefinition(props.definition), [props.definition]);

    const boardState = useMemo(() => props.state.boards['board']!, [props.state.boards]);

    const possibleMoves = useMemo(
        () => game.getPossibleActions(currentPlayer, props.state)
        , [currentPlayer, props.state, game]
    );

    return <GameBoard
        game={game}
        state={boardState}
        possibleMoves={possibleMoves}
    />
}