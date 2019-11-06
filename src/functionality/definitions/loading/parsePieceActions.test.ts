import { parsePieceActions } from './parsePieceActions';
import { MoveType } from '../MoveType';
import { GameDefinition } from '../GameDefinition';

type SimpleExample = [string, MoveType, Array<[string[], number, number | undefined]>];

const game = new GameDefinition({
    boards: {},
    rules: '',
    pieces: {}
});

it('parses simple example actions', () => {
    const examples: SimpleExample[] = [
        ['It can slide 1 cell forward.', MoveType.Slide, [[['forward'], 1, 1]]],
        ['It can slide 1 cell forward to an empty cell.', MoveType.Slide, [[['forward'], 1, 1]]],
        ['It can slide any distance diagonally.', MoveType.Slide, [[['diagonally'], 1, undefined]]],
        ['It can slide any distance diagonally to a cell containing an enemy piece.', MoveType.Slide, [[['diagonally'], 1, undefined]]],
        ['It can slide any distance orthogonally or diagonally.', MoveType.Slide, [[['orthogonally', 'diagonally'], 1, undefined]]],
        ['It can hop up to 3 cells orthogonally.', MoveType.Hop, [[['orthogonally'], 1, 3]]],
        ['It can leap 2 to 4 cells horizontally or vertically.', MoveType.Leap, [[['horizontally', 'vertically'], 2, 4]]],
        ['It can leap 2 cells orthogonally, then 1 cell perpendicularly.', MoveType.Leap, [[['orthogonally'], 2, 2], [['perpendicularly'], 1, 1]]],
        ['It can leap 2 cells orthogonally, then 1 cell perpendicularly, then optionally 1 cell forward.', MoveType.Leap, [[['orthogonally'], 2, 2], [['perpendicularly'], 1, 1], [['forward'], 1, 1]]],
        ['It can leap 2 cells diagonally.', MoveType.Leap, [[['diagonally'], 2, 2]]],
        ['It can slide at least 2 cells orthogonally.', MoveType.Slide, [[['orthogonally'], 2, undefined]]],
        ['If it has never moved, it can slide 2 cells forward to an empty cell.', MoveType.Slide, [[['forward'], 2, 2]]],
        ['It can slide 1 cell sideways to a cell containing an enemy pawn, then 1 cell forward.', MoveType.Slide, [[['sideways'], 1, 1], [['forward'], 1, 1]]],
        ['It can slide 1 cell sideways to a cell containing an enemy pawn that first moved 1 turn ago, then 1 cell forward.', MoveType.Slide, [[['sideways'], 1, 1], [['forward'], 1, 1]]],
        //['If it is in the enemy en passant zone, it can slide 1 cell sideways to a cell containing an enemy pawn that first moved 1 turn ago, then 1 cell forward.', MoveType.Slide, [[['sideways'], 1, 1], [['forward'], 1, 1]]],
    ];

    const directions = new Set<string>([
        'forward', 'orthogonally', 'diagonally', 'horizontally', 'vertically', 'sideways',
        'perpendicularly' // TODO: should relative directions be passed separately?
    ]);

    for (const example of examples) {
        const result = parsePieceActions(game, example[0], directions);
        
        if (result.success) {
            expect(result.definition).toHaveLength(1);
            const definition = result.definition[0];

            expect(definition.moveType).toBe(example[1]);

            const exampleSequences = example[2];
            expect(definition.moveSequence).toHaveLength(exampleSequences.length);

            for (let iSequence = 0; iSequence < exampleSequences.length; iSequence++) {
                const sequence = definition.moveSequence[iSequence];
                const exampleSequence = exampleSequences[iSequence];
                
                expect(sequence.minDistance).toBe(exampleSequence[1]);
                expect(sequence.maxDistance).toBe(exampleSequence[2]);

                const exampleDirs = exampleSequence[0];
                expect(sequence.directions).toHaveLength(exampleDirs.length);
                
                for (let iDir = 0; iDir < exampleDirs.length; iDir++) {
                    expect(sequence.directions[iDir]).toBe(exampleDirs[iDir]);
                }
            }
        }
        else {
            expect(result.errors).toHaveLength(0);
        }

        expect(result.success).toBe(true);
    }
});


type SimpleErrorExample = [string, Array<[string, number, number]>];

it('Correctly marks errors in erroneous simple examples', () => {
    const examples: SimpleErrorExample[] = [
        ['It can slide 0 cells forward.', [['Distance value must be greater than zero.', 13, 1]]],
        ['It can slide 3 cells sideways.', [['Unrecognised direction.', 21, 8]]],
        ['It can slide 0 cells sideways.', [['Distance value must be greater than zero.', 13, 1], ['Unrecognised direction.', 21, 8]]],
        ['It can leap 4 to 2 cells orthogonally.', [['Second distance value must be greater than the first value.', 17, 1]]],
        ['It can leap 50 to 17 cells orthogonally.', [['Second distance value must be greater than the first value.', 18, 2]]],
        ['It can hop any quantity of cells orthogonally.', [['Unrecognised distance: any quantity of.', 11, 15]]],
    ];

    const directions = new Set<string>(['forward', 'orthogonally', 'diagonally']);

    for (const example of examples) {
        const result = parsePieceActions(game, example[0], directions);
        
        if (!result.success) {
            const expectedErrors = example[1];
            expect(result.errors).toHaveLength(expectedErrors.length);

            for (let i = 0; i < expectedErrors.length; i++) {
                const error = result.errors[i];
                const expected = expectedErrors[i];
                expect(error.message).toContain(expected[0]);
                expect(error.startIndex).toBe(expected[1]);
                expect(error.length).toBe(expected[2]);
            }
        }

        expect(result.success).toBe(false);
    }
});
