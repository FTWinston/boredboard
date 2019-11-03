import { IParserError, ISentenceParser } from 'natural-configuration';
import { GameRules } from '../../GameRules';
import { IGameRulesOptions } from './parser';

export const turnOrder/*: ISentenceParser<GameRules, IGameRulesOptions>*/ = {
    type: 'standard' as 'standard', // if the above type definition worked properly, this assertion wouldn't be needed
    expressionText: 'Players take (alternate turns(, starting with (a random player|player (\\d+))?|turns in the following sequence: (\\d+(?:, \\d+)*)))',
    parseMatch: (
        match: RegExpExecArray,
        action: (action: (modify: GameRules) => void) => void,
        error: (error: IParserError) => void,
        options?: IGameRulesOptions
    ) => {
        let sequence: number[];
        let startRandom = false;

        const match1 = match[1];
        if (match1.startsWith('alternate turns')) {
            if (match[2] === undefined) {
                error({
                    message: 'Need to specify which player goes first, e.g. "starting with player 1" or "starting with a random player"',
                    startIndex: 13,
                    length: 15,
                })

                return;
            }

            let numPlayers = options === undefined
                ? 2
                : options.numPlayers;

            const strStartNumber = match[4];
            let startNumber: number;

            if (strStartNumber === undefined) {
                startRandom = true;
                startNumber = 1;
            }
            else {
                startNumber = parseInt(strStartNumber);
            }
            
            if (startNumber > numPlayers) {
                error({
                    message: `Specified that turns should start with player ${startNumber}, but the this game only supports up to ${numPlayers} players.`,
                    startIndex: 51,
                    length: match[0].length - 51,
                });

                return;
            }

            sequence = [];
            
            for (let i = startNumber; i <= numPlayers; i++) {
                sequence.push(i);
            }

            for (let i = 1; i < startNumber; i++) {
                sequence.push(i);
            }
        }
        else {
            sequence = match[5].split(', ').map(s => parseInt(s));
        }

        action(modify => {
            modify.turnSequence = sequence;
            modify.startRandomTurnSequence = startRandom;
        });
    },
    examples: [
        'Players take alternate turns, starting with player 1.',
        'Players take alternate turns, starting with a random player.',
        'Players take turns in the following sequence: 1, 2, 1, 1, 2, 1, 1, 1, 2.',
    ],
};