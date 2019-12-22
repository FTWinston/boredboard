import chessDefinition from './index';
import { GameDefinition } from '../../functionality/definitions';

it('Has initial chess moves', () => {
    const game = new GameDefinition(chessDefinition);

    const actions = game.getPossibleActions(1, chessDefinition.initialState);

    expect(actions).toHaveLength(20);
});