import { GameDefinition } from './GameDefinition';
import { IGameState } from '../instances/IGameState';
import chessboard from '../../examples/chess/board.json';
import { rules } from '../../examples/chess/rules';

type SimpleExample = [string, string, string[]];

const boardID = 'board';
const pieceID = 'test';

function createGame(pieceLocation: string, pieceBehaviour: string): [GameDefinition, IGameState] {
    const game = new GameDefinition({
        rules: rules,
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
        boards: { [boardID]: { definition: boardID, cellContents: { [pieceLocation]: { 1: { definition: pieceID, owner: 1 } } } } },
        currentTurn: 1,
    }

    return [
        game,
        state,
    ];
}

it('Calculates piece movement', () => {
    const examples: SimpleExample[] = [
        ['It can slide 1 cell north.', 'A4', ['B4']],
        ['It can slide 1 cell north. It can slide 2 cells north.', 'A4', ['B4', 'C4']],
        ['It can slide 1 to 2 cells forward.', 'A4', ['B4', 'C4']],
        ['It can slide any distance diagonally.', 'B5', ['C6', 'D7', 'E8', 'C4', 'D3', 'E2', 'F1', 'A6', 'A4']],
        ['It can leap 2 cells orthogonally, then 1 cell perpendicularly.', 'B5', ['A3', 'C3', 'A7', 'C7', 'D6', 'D4']],
    ];

    for (const example of examples) {
        const [game, state] = createGame(example[1], example[0]);

        const piece = game.pieces.get(pieceID)!;

        const actions = piece.getPossibleActions(state, boardID, example[1], '1');

        const destinations = actions.map(m => m.pieceMovement[0].toCell);

        expect(destinations).toEqual(example[2]);
    }
});