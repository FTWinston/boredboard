import React, { FunctionComponent, useMemo, useState } from 'react';
import { SvgLoader } from 'react-svgmt';
import { BoardDisplay } from '../components/board/BoardDisplay';
import './GameBoard.css';
import { ICellItem } from '../components/board/ICellItem';
import { GameDefinition } from '../functionality/definitions';
import { IBoard } from '../functionality/instances/IBoard';
import { IPiece } from '../functionality/instances/IPiece';
import { IPlayerAction } from '../functionality/instances/IPlayerAction';

interface Props {
    game: GameDefinition;
    state: IBoard;
    possibleMoves: IPlayerAction[];
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

    const [selectedCell, setSelectedCell] = useState(undefined as string | undefined);

    const selectableCells = useMemo(
        () => {
            if (selectedCell !== undefined) {
                return new Set<string>([selectedCell]);
            }

            const cells = props.possibleMoves.map(
                m => m.fromCell !== undefined
                    ? m.fromCell
                    : m.targetCell === undefined
                        ? undefined
                        : m.targetCell
            ).filter(c => c !== undefined) as string[];
            
            return new Set<string>(cells);
        }
        , [selectedCell, props.possibleMoves]
    );

    const moveableCells = useMemo(
        () => {
            if (selectedCell === undefined) {
                return undefined;
            }

            const cells = props.possibleMoves
                .filter(m => m.fromCell === selectedCell)
                .map(m => m.targetCell)
                .filter(m => m !== undefined) as string[];

            return new Set<string>(cells);
        }
        , [selectedCell, props.possibleMoves]
    );

    if (boardDef === undefined) {
        return <div>Error: Board definition not found</div>
    }

    return (
        <BoardDisplay
            className="gameBoard"
            filePath={boardDef.imageUrl}
            cells={boardDef.cells}
            contents={contents}
            selectableCells={selectableCells}
            moveableCells={moveableCells}
            cellClicked={cell => setSelectedCell(selectedCell === cell ? undefined : cell)}
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
        return `${piece.definition} error`;
    }
    
    const imageUrl = definition.imageUrls.get(piece.owner);
    if (imageUrl === undefined) {
        console.log(`Piece has no image for player ${piece.owner}`, definition.imageUrls);
        return `${piece.definition} error`;
    }

    return <SvgLoader
        path={imageUrl}
        className="board__piece"
    />
}