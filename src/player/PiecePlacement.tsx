import React, { FunctionComponent, useMemo, useState } from 'react';
import { IPiece } from '../functionality/instances/IPiece';
import { IBoard } from '../functionality/instances/IBoard';
import { GameDefinition } from '../functionality/definitions/GameDefinition';
import { PieceDisplay } from '../components/PieceDisplay';
import { BoardDisplay } from '../components/board/BoardDisplay';
import { LabelStyle } from '../data/LabelSize';
import './PiecePlacement.css';
import { createPieceDisplays } from './GameBoard';
import { useHistory } from 'react-router-dom';

interface Props {
    game: GameDefinition;
    board: string;
    numPlayers: number;
    initialState: IBoard;
    save: (state: IBoard) => void;
    closeUrl: string;
    firstPieceID: number;
}

export const PiecePlacement: FunctionComponent<Props> = props => {
    const boardDefinition = useMemo(
        () => props.game.boards.get(props.board)!,
        [props.game, props.board]
    );

    const [nextPieceID, setNextPieceID] = useState(props.firstPieceID);

    const incrementNextPieceID = useMemo(() =>
        () => setNextPieceID(prevID => prevID + 1),
        []
    );

    const [boardState, setBoardState] = useState<IBoard>(props.initialState);

    const history = useHistory();

    const close = useMemo(() =>
        () => {
            history.push(props.closeUrl);
        },
        [props.closeUrl, history]
    );

    const { save } = props;
    const saveAndClose = useMemo(() =>
        () => {
            save(boardState);
            close();
        },
        [close, save, boardState]
    );

    const pieceOptions = useMemo(() =>
        {
            const pieces: IPiece[] = [];

            for (let player = 1; player <= props.numPlayers; player++) {
                for (const [typeName] of props.game.pieces) {
                    pieces.push({
                        definition: typeName,
                        owner: player,
                    });
                }
            }

            return pieces;
        },
        [props.game.pieces, props.numPlayers]
    )

    const [selectedIndex, setSelectedIndex] = useState(0);

    const pieceOptionDisplay = useMemo(() => {
            return pieceOptions.map((piece, index) => (
                <PieceDisplay
                    className={index === selectedIndex ? "piecePlacement__option piecePlacement__option--selected" : "piecePlacement__option"}
                    key={index}
                    game={props.game}
                    definition={piece.definition}
                    owner={piece.owner}
                    onClick={() => setSelectedIndex(index)}
                />
            ));
        },
        [pieceOptions, props.game, selectedIndex]
    );

    const contents = useMemo(
        () => createPieceDisplays(props.game, boardState.cellContents),
        [boardState.cellContents, props.game]
    );

    const cellClicked = useMemo(
        () => (cell: string) => {
            const piecesInCell = boardState.cellContents[cell];

            if (piecesInCell === undefined) {
                const newPiece = { ...pieceOptions[selectedIndex] };
                const newId = nextPieceID;
                incrementNextPieceID();

                // add to cell
                setBoardState(state => ({
                    ...state,
                    cellContents: {
                        ...state.cellContents,
                        [cell]: {
                            [newId]: newPiece,
                        },
                    },
                }));
            }
            else {
                // remove from cell
                setBoardState(state => {
                    const newContents = { ...state.cellContents };
                    delete newContents[cell];

                    return {
                        ...state,
                        cellContents: newContents,
                    }
                });
            }
        },
        [selectedIndex, pieceOptions, boardState.cellContents, nextPieceID, incrementNextPieceID]
    );

    return (
        <div className="boardEditor piecePlacement">
            <BoardDisplay
                className="boardEditor__board"
                filePath={boardDefinition.imageUrl}
                cells={boardDefinition.cells}
                labelStyle={LabelStyle.SmallCorner}
                selectableCells={boardDefinition.cells}
                contents={contents}
                cellClicked={cellClicked}
            />
            
            <div className="boardEditor__content">
                <p>
                    Select a piece type from the list below and click the board to add it.
                    <br/>Click on an existing piece on the board to remove it.
                </p>

                <div className="piecePlacement__options">
                    {pieceOptionDisplay}
                </div>
            </div>

            <div className="boardEditor__navigation">
                <button onClick={close}>Cancel</button>
                <button onClick={saveAndClose}>Save layout</button>
            </div>
        </div>
    );
}