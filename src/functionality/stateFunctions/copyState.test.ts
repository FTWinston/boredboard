import { copyState } from './copyState';
import sampleState from '../../examples/chess state.json';

it('Correctly copies game state', () => {
    const str1 = JSON.stringify(sampleState);

    const newState = copyState(sampleState);

    const str2 = JSON.stringify(newState);

    expect(str2).toEqual(str1);
});