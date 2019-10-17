import { parsePieceActions } from './parsePieceActions';

it('parses simple example action', () => {
    const result = parsePieceActions('It can slide 1 cell forward.');
    
    if (result.success) {
        expect(result.definition).toHaveLength(1);

        const definition = result.definition[0];
        expect(definition.minDistance).toBe(1);
        expect(definition.maxDistance).toBe(1);
        expect(definition.direction).toBe('forward');
    }
    else {
        expect(result.errors).toHaveLength(0);
    }

    expect(result.success).toBe(true);
});
