import { GameDefinition } from '../GameDefinition';
import chess from '../../../examples/chess/index'

it('parses simple example rules', () => {
    const game = new GameDefinition(chess);

    expect (game.rules.captureStopRelations).not.toEqual(0);
});
