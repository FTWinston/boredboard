import React, { FunctionComponent, useMemo, useState } from 'react';
import { IPiece } from '../functionality/instances/IPiece';
import { IBoard } from '../functionality/instances/IBoard';
import { GameDefinition } from '../functionality/definitions/GameDefinition';
import { BoardDefinition } from '../functionality/definitions/BoardDefinition';
import { PieceDisplay } from '../components/PieceDisplay';
import { BoardDisplay } from '../components/board/BoardDisplay';
import { LabelStyle } from '../data/LabelSize';

interface Props {
    board: BoardDefinition;
    game: GameDefinition;
    numPlayers: number;
    setState: (state: IBoard) => void;
}

export const PiecePlacement: FunctionComponent<Props> = props => {
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

    const [selectedIndex, setSelectedIndex] = useState(1);

    const pieceOptionDisplay = useMemo(() => {
            return pieceOptions.map((piece, index) => (
                <PieceDisplay
                    className={index === selectedIndex ? "boardState__option boardState__option--selected" : "boardState__option"}
                    key={index}
                    game={props.game}
                    definition={piece.definition}
                    owner={piece.owner}
                    onClick={() => setSelectedIndex(index)}
                />
            ));
        },
        [pieceOptions, props.game, selectedIndex]
    )

    return (
        <div className="boardEditor boardState">
            <BoardDisplay
                className="boardEditor__board"
                filePath={props.board.imageUrl}
                cells={props.board.cells}
                labelStyle={LabelStyle.FillCell}
                selectableCells={props.board.cells}
            />
            
            <div className="boardEditor__content">
                <p>
                    Select a piece type from the list below and click the board to add it.
                    <br/>Click on an existing piece on the board to remove it.
                </p>

                <div className="boardState__options">
                    {pieceOptionDisplay}
                </div>
            </div>
        </div>
    );
}