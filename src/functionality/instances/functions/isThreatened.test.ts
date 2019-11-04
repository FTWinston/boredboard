import chessboard from '../../../examples/chess/board.json';
import { GameDefinition } from '../../definitions/GameDefinition';
import { IGameState } from '../IGameState';
import { rules } from '../../../examples/chess/rules';
import rook from '../../../examples/chess/pieces/rook.json';
import { isThreatened, wouldBeThreatenedAt } from './isThreatened';

type FixedExample = [string, string, boolean];
type MoveExample = [string, string, string, boolean];

const boardID = 'board';
const pieceID = 'test';

function createGame(testPieceLocation: string, otherPieceLocation: string): [GameDefinition, IGameState] {
    const game = new GameDefinition({
        rules,
        boards: {
            [boardID]: chessboard,
        },
        pieces: {
            [pieceID]: rook
        },
    });

    const state: IGameState = {
        boards: {
            [boardID]: {
                definition: boardID,
                cellContents: {
                    [testPieceLocation]: { '1': { definition: pieceID, owner: 1 } },
                    [otherPieceLocation]: { '2': { definition: pieceID, owner: 2 } },
                }
            }
        },
        currentTurn: 1,
    }

    return [
        game,
        state,
    ];
}

it('Detects threatened pieces in-place', () => {
    const examples: FixedExample[] = [
        ['B5', 'D5', true],
        ['B5', 'D4', false],
    ];

    for (const example of examples) {
        const [testLocation, otherLocation, expectedResult] = example;

        const [game, state] = createGame(testLocation, otherLocation);

        const result = isThreatened(game, state, boardID, '1', testLocation);

        expect(result).toEqual(expectedResult);
    }
});

it('Detects threatened pieces at other locations', () => {
    const examples: MoveExample[] = [
        ['B4', 'B5', 'D5', true],
        ['B4', 'B5', 'D4', false],
        ['B5', 'A5', 'D5', true],
    ];

    for (const example of examples) {
        const [currentLocation, testLocation, otherLocation, expectedResult] = example;

        const [game, state] = createGame(currentLocation, otherLocation);

        const result = wouldBeThreatenedAt(game, state, boardID, '1', currentLocation, testLocation);

        expect(result).toEqual(expectedResult);
    }
});