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
    closeUrl: string;
    firstPieceID: number;
}

const BoardStateEditor: FunctionComponent<Props> = props => {
    const id = props.match.params.id;

    const initialState = useMemo(
        () => ({ definition: id, cellContents: {}}),
        [id]
    )

    const { saveData } = props;
    const setState = useMemo(
        () => {
            return (state: IBoard) => saveData(id, state);
        },
        [saveData, id]
    );

    const board = useMemo(
        () => props.game.boards.get(id),
        [id, props.game]
    );

    if (board === undefined) {
        return <div>Board not recognised: {id}</div>;
    }
    
    return <PiecePlacement
        game={props.game}
        board={id}
        numPlayers={props.numPlayers}
        initialState={initialState}
        save={setState}
        closeUrl={props.closeUrl}
        firstPieceID={props.firstPieceID}
    />
}

export default withRouter(BoardStateEditor);