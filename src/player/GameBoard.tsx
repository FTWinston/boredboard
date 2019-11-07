import React, { FunctionComponent, useMemo } from 'react';
import { BoardDisplay } from '../components/board/BoardDisplay';
import { GameDefinition } from '../functionality/definitions';
import chess from '../examples/chess'
import initialState from '../examples/chess/state.json'
import './GameBoard.css';
import { ICellItem } from '../components/board/ICellItem';
import { IGameState } from '../functionality/instances/IGameState';

interface Props {

}

export const GameBoard: FunctionComponent<Props> = props => {
    const game = useMemo(() => new GameDefinition(chess), []);

    const rawBoard = useMemo(() => chess.boards['board']!, []);

    const cells = useMemo(() => {
        const ids: string[] = [];
        for (const cell in rawBoard.links) {
            ids.push(cell);
        }
        return ids;
    }, [rawBoard]);


    const contents = useMemo(() => {
        const output: ICellItem[] = [];
        const cellContents = (initialState as IGameState).boards['board']!.cellContents;

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
    }, []);

    return <BoardDisplay
        className="gameBoard"
        filePath={rawBoard.imageUrl}
        cells={cells}
        contents={contents}
    />
}