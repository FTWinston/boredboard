import { parsePieceActions } from './parsePieceActions';
import { GameDefinition } from './GameDefinition';
import { IGameState } from '../instances';
import chessboard from '../../examples/chessboard.json';

type SimpleExample = [string, string, string[]];

const boardID = 'board';
const pieceID = 'test';

function createGame(pieceLocation: string, pieceBehaviour: string): [GameDefinition, IGameState, ReadonlySet<string>] {
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

    const directions = game.boards.get('board')!.allNamedDirections;

    const state: IGameState = {
        boards: { [boardID]: { definition: boardID, cellContents: { [pieceLocation]: { 1: { definition: pieceID, owner: 1 } } } } }
    }

    return [
        game,
        state,
        directions,
    ]
}

it('Calculates simple movements', () => {
    const examples: SimpleExample[] = [
        ['It can slide 1 cell north.', 'A4', ['B4']],
        ['It can slide 1 cell north. It can slide 2 cells north.', 'A4', ['B4', 'C4']],
        ['It can slide 1 to 2 cells forward.', 'A4', ['B4', 'C4']],
        ['It can slide any distance diagonally.', 'B5', ['A4', 'A6', 'C4', 'C6', 'D3', 'D7', 'E2', 'E8', 'F1']],
        ['It can leap 2 cells orthogonally then 1 cell perpendicularly.', 'B5', ['A3', 'A7', 'C3', 'C7', 'D4', 'D6']],
    ];

    for (const example of examples) {
        const [game, state, directions] = createGame(example[1], example[0]);

        const result = parsePieceActions(example[0], directions);
        
        if (result.success) {
            expect(result.definition).toHaveLength(1);
            
            const definition = result.definition[0];

            const actions = definition.getPossibleActions(game, state, boardID, example[1], 1);

            const destinations = actions.map(m => m.pieceMovement[0].toCell);

            expect(destinations).toEqual(example[2]);
        }
        else {
            expect(result.errors).toHaveLength(0);
        }

        expect(result.success).toBe(true);
    }
});


it('Calculates piece movement', () => {
    const examples: SimpleExample[] = [
        ['It can slide 1 cell north.', 'A4', ['B4']],
        ['It can slide 1 cell north. It can slide 2 cells north.', 'A4', ['B4', 'C4']],
        ['It can slide 1 to 2 cells forward.', 'A4', ['B4', 'C4']],
        ['It can slide any distance diagonally.', 'B5', ['A4', 'A6', 'C4', 'C6', 'D3', 'D7', 'E2', 'E8', 'F1']],
        ['It can leap 2 cells orthogonally then 1 cell perpendicularly.', 'B5', ['A3', 'A7', 'C3', 'C7', 'D4', 'D6']],
    ];

    for (const example of examples) {
        const [game, state] = createGame(example[1], example[0]);

        const piece = game.pieces.get(pieceID)!;

        const actions = piece.getPossibleActions(game, state, boardID, example[1], 1);

        const destinations = actions.map(m => m.pieceMovement[0].toCell);

        expect(destinations).toEqual(example[2]);
    }
});