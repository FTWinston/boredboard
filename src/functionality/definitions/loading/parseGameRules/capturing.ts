import { GameRules } from '../../GameRules';

export const capturing/*: ISentenceParser<GameRules, IGameRulesOptions>*/ = {
    type: 'standard' as 'standard', // if the above type definition worked properly, this assertion wouldn't be needed
    expressionText: 'If a piece (stops in|moves through) the same cell as (a friendly|an enemy|any) piece, it captures it',
    parseMatch: (
        match: RegExpExecArray,
        action: (action: (modify: GameRules) => void) => void
    ) => {
        // TODO: htis
        action(modify => {});
    },
    examples: [
        'If a piece stops in the same cell as an enemy piece, it captures it.',
        'If a piece moves through the same cell as an enemy piece, it captures it.',
    ],
};