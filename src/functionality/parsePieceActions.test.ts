import { parsePieceActions } from './parsePieceActions';
import { MoveType } from './MoveType';

type SimpleExample = [string, MoveType, Array<[string[], number, number | undefined]>];

it('parses simple example actions', () => {
    const examples: SimpleExample[] = [
        ['It can slide 1 cell forward.', MoveType.Slide, [[['forward'], 1, 1]]],
        ['It can slide any distance diagonally.', MoveType.Slide, [[['diagonally'], 1, undefined]]],
        ['It can slide any distance orthogonally or diagonally.', MoveType.Slide, [[['orthogonally', 'diagonally'], 1, undefined]]],
        ['It can hop up to 3 cells orthogonally.', MoveType.Hop, [[['orthogonally'], 1, 3]]],
        ['It can leap 2 to 4 cells horizontally or vertically.', MoveType.Leap, [[['horizontally', 'vertically'], 2, 4]]],
        ['It can leap 2 cells diagonally.', MoveType.Leap, [[['diagonally'], 2, 2]]],
        ['It can slide at least 2 cells orthogonally.', MoveType.Slide, [[['orthogonally'], 2, undefined]]],
    ];

    for (const example of examples) {
        const result = parsePieceActions(example[0]);
        
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


type SimpleErrorExample = [string, string, number, number];

it('Correctly marks errors in erroneous simple examples', () => {
    const examples: SimpleErrorExample[] = [
        ['It can slide 0 cells forward.', 'Distance value must be greater than zero.', 13, 1],
        ['It can leap 4 to 2 cells orthogonally.', 'Second distance value must be greater than the first value.', 17, 1],
        ['It can leap 50 to 17 cells orthogonally.', 'Second distance value must be greater than the first value.', 18, 2],
        ['It can hop any quantity of cells orthogonally.', 'Unrecognised distance: any quantity of cells.', 11, 21],
    ];

    for (const example of examples) {
        const result = parsePieceActions(example[0]);
        
        if (!result.success) {
            expect(result.errors).toHaveLength(1);

            const error = result.errors[0];
            expect(error.message).toContain(example[1]);
            expect(error.startIndex).toBe(example[2]);
            expect(error.length).toBe(example[3]);
        }

        expect(result.success).toBe(false);
    }
});
