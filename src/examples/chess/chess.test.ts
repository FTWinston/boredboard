import chessDefinition from './index';
import chessState from './state.json';
import { GameDefinition } from '../../functionality/definitions';

it('Has initial chess moves', () => {
    const game = new GameDefinition(chessDefinition);

    const actions = game.getPossibleActions(1, chessState);

    expect(actions).toHaveLength(20);
});