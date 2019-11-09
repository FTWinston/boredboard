import React, { FunctionComponent, useMemo } from 'react';
import { BoardDisplay } from '../components/board/BoardDisplay';
import './GameBoard.css';
import { ICellItem } from '../components/board/ICellItem';
import { GameDefinition } from '../functionality/definitions';
import { IBoard } from '../functionality/instances/IBoard';
import { IPiece } from '../functionality/instances/IPiece';

interface Props {
    game: GameDefinition;
    state: IBoard;
}

export const GameBoard: FunctionComponent<Props> = props => {
    const boardDef = useMemo(
        () => props.game.boards.get(props.state.definition),
        [props.game, props.state]
    );

    const contents = useMemo(() => {
        const output: ICellItem[] = [];
        const cellContents = props.state.cellContents;

        for (const cell in cellContents) {
            const cellContent = cellContents[cell]!;
            for (const id in cellContent) {
                const piece = cellContent[id]!;

                output.push({
                    key: id,
                    cell,
                    display: determinePieceDisplay(piece, props.game),
                });
            }
        }
        return output;
    }, [props.state.cellContents, props.game]);

    if (boardDef === undefined) {
        return <div>Error: Board definition not found</div>
    }

    return (
        <BoardDisplay
            className="gameBoard"
            filePath={boardDef.imageUrl}
            cells={boardDef.cells}
            contents={contents}
        />
    );
}

function determinePieceDisplay(
    piece: IPiece,
    game: GameDefinition
) {
    const definition = game.pieces.get(piece.definition);
    if (definition === undefined) {
        console.log(`cannot find piece definition: ${piece.definition}`);
        return 'error';
    }
    
    const imageUrl = definition.imageUrls.get(piece.owner);
    if (imageUrl === undefined) {
        console.log(`Piece has no image for player ${piece.owner}`, definition.imageUrls);
        return 'error';
    }

    return <img src={imageUrl} alt={`player ${piece.owner} ${piece.definition}`} />;
}
