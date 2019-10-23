import chessboard from '../../examples/chessboard.json';
import { GameDefinition } from '../definitions/GameDefinition';
import { IGameState } from '../instances/IGameState';
import { getPossibleActions } from './getPossibleActions';

type SimpleExample = [string, string, string[]];

const boardID = 'board';
const pieceID = 'test';

function createGame(pieceLocation: string, pieceBehaviour: string): [GameDefinition, IGameState] {
    const game = new GameDefinition({
        boards: {
            [boardID]: chessboard,
        },
        pieces: {
            [pieceID]: {
                imageUrls: {},
                behaviour: pieceBehaviour,
                value: 1,
            }
        },
    });

    const state: IGameState = {
        boards: { [boardID]: { definition: boardID, cellContents: { [pieceLocation]: { 1: { definition: pieceID, owner: 1 } } } } }
    }

    return [
        game,
        state,
    ];
}

it('Finds pieces to move', () => {
    const examples: SimpleExample[] = [
        ['It can slide any distance diagonally.', 'B5', ['C6', 'D7', 'E8', 'C4', 'D3', 'E2', 'F1', 'A6', 'A4']],
    ];

    for (const example of examples) {
        const [game, state] = createGame(example[1], example[0]);

        const actions = getPossibleActions(game, state, 1);

        const destinations = actions.map(m => m.pieceMovement[0].toCell);

        expect(destinations).toEqual(example[2]);
    }
});