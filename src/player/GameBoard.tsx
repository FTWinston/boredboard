import React, { FunctionComponent, useMemo, useState, useLayoutEffect } from 'react';
import { BoardDisplay } from '../components/board/BoardDisplay';
import './GameBoard.css';
import { ICellItem } from '../components/board/ICellItem';
import { GameDefinition } from '../functionality/definitions';
import { IBoard } from '../functionality/instances/IBoard';
import { IPlayerAction } from '../functionality/instances/IPlayerAction';
import { PieceDisplay } from '../components/PieceDisplay';
import { Dictionary } from '../data/Dictionary';
import { IPiece } from '../functionality/instances/IPiece';

interface Props {
    game: GameDefinition;
    state: IBoard;
    possibleMoves: IPlayerAction[];
    selectAction?: (action: IPlayerAction) => void;
}

export const GameBoard: FunctionComponent<Props> = props => {
    const boardDef = useMemo(
        () => props.game.boards.get(props.state.definition),
        [props.game, props.state]
    );

    const contents = useMemo(
        () => createPieceDisplays(props.game, props.state.cellContents),
        [props.state.cellContents, props.game]
    );

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

    const { selectAction, possibleMoves } = props;

    const cellClicked = useMemo(() => {
        return (cell: string) => {
            if (selectAction !== undefined && moveableCells !== undefined && moveableCells.has(cell)) {
                const possibleActions = possibleMoves.filter(m => m.fromCell === selectedCell && m.targetCell === cell);
                if (possibleActions.length > 0) {
                    selectAction(possibleActions[0]);
                    // TODO: disambiguate between possible moves
                }
            }
            
            setSelectedCell(selectedCell === cell ? undefined : cell);
        }
    }, [selectedCell, selectAction, possibleMoves, moveableCells]);

    useLayoutEffect(() => {
        // clear selection when possible moves change
        if (selectedCell !== undefined) {
            setSelectedCell(undefined);
        }
    }, [props.possibleMoves, props.state]); // eslint-disable-line

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
            cellClicked={cellClicked}
        />
    );
}

export function createPieceDisplays(game: GameDefinition, cellContents: Dictionary<string, Dictionary<string, IPiece>>) {
    const output: ICellItem[] = [];

    for (const cell in cellContents) {
        const cellContent = cellContents[cell]!;

        for (const id in cellContent) {
            const piece = cellContent[id]!;

            output.push({
                key: id,
                cell,
                display: <PieceDisplay className="board__piece" game={game} definition={piece.definition} owner={piece.owner} />,
            });
        }
    }

    return output;
}
