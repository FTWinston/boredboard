import React, { FunctionComponent, useMemo } from 'react';
import { GameDefinition } from '../../functionality/definitions/GameDefinition';
import { IBoard } from '../../functionality/instances/IBoard';
import { RouteComponentProps, withRouter } from 'react-router-dom';
import { PiecePlacement } from '../../player/PiecePlacement';

interface Match {
    id: string;
}

interface Props extends RouteComponentProps<Match>{
    game: GameDefinition;
    numPlayers: number;
    saveData: (id: string, state: IBoard) => void;
}

const BoardStateEditor: FunctionComponent<Props> = props => {
    const id = props.match.params.id;

    const board = useMemo(
        () => props.game.boards.get(id),
        [id, props.game]
    );

    const { saveData } = props;
    const setState = useMemo(
        () => {
            return (state: IBoard) => saveData(id, state);
        },
        [saveData, id]
    );

    if (board === undefined) {
        return <div>Board not recognised: {props.match.params.id}</div>;
    }

    return <PiecePlacement
        board={board}
        game={props.game}
        numPlayers={props.numPlayers}
        setState={setState}
    />
}

export default withRouter(BoardStateEditor);