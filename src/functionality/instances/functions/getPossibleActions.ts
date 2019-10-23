import { IGameState } from '../IGameState';
import { IPlayerAction } from '../IPlayerAction';
import { GameDefinition } from '../../definitions';

export function getPossibleActions(game: GameDefinition, state: IGameState, player: number) {
    let actions: IPlayerAction[] = [];

    // TODO: a lookup for where each piece is would be kinda handy...

    for (const board in state.boards) {
        const boardData = state.boards[board]!;

        for (const cell in boardData.cellContents!) {
            const cellContent = boardData.cellContents![cell];
            
            for (const piece in cellContent) {
                const pieceData = cellContent[piece as unknown as number]!;

                if (pieceData.owner === player) {
                    const pieceDefinition = game.pieces.get(pieceData.definition);

                    if (pieceDefinition !== undefined) {
                        actions = [
                            ...actions,
                            ...pieceDefinition.getPossibleActions(game, state, board, cell, piece as unknown as number),
                        ];
                    }
                }
            }
        }
    }

    return actions;
}