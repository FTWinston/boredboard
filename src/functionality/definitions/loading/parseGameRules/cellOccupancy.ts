import { GameRules } from '../../GameRules';

export const cellOccupancy/*: ISentenceParser<GameRules, IGameRulesOptions>*/ = {
    type: 'standard' as 'standard', // if the above type definition worked properly, this assertion wouldn't be needed
    expressionText: '((?:Only|Up to) (\d+) piece(?:s)? can|Multiple pieces cannot|Any number of pieces can) occupy the same cell',
    parseMatch: (
        match: RegExpExecArray,
        action: (action: (modify: GameRules) => void) => void
    ) => {
        const strNum = match[2];

        const num = strNum !== undefined
            ? parseInt(strNum)
            : match[1] === 'Multiple pieces cannot'
                ? 1
                : undefined;

        action(modify => {
            modify.maxCellOccupancy = num;
        });
    },
    examples: [ // TODO: team-based occupancy? Board-based occupancy rules?
        'Multiple pieces cannot occupy the same cell.',
        'Up to 3 pieces can occupy the same cell.',
        'Any number of pieces can occupy the same cell.',
    ],
};