import React, { FunctionComponent, useMemo } from 'react';
import { BoardDisplay } from '../components/board/BoardDisplay';
import './GameBoard.css';
import { ICellItem } from '../components/board/ICellItem';
import { GameDefinition } from '../functionality/definitions';
import { IBoard } from '../functionality/instances/IBoard';

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
                    cell: cell,
                    display: piece.definition, // TODO: image
                });
            }
        }
        return output;
    }, [props.state.cellContents]);

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