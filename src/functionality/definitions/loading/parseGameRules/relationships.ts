import { GameRules } from '../../GameRules';
import { Relationship } from '../../Relationship';

export const relationships/*: ISentenceParser<GameRules, IGameRulesOptions>*/ = {
    type: 'standard' as 'standard', // if the above type definition worked properly, this assertion wouldn't be needed
    expressionText: 'Player (\d+) is an (ally|enemy) of player (\d+)(, and vice versa)?',
    parseMatch: (
        match: RegExpExecArray,
        action: (action: (modify: GameRules) => void) => void
    ) => {
        const from = parseInt(match[3]);
        const to = parseInt(match[1]);

        let relationship: Relationship;

        switch (match[2]) {
            case 'ally':
                relationship = Relationship.Ally;
                break;
            case 'enemy':
                relationship = Relationship.Enemy;
                break;
            default:
                return;
        }

        const twoWay = match[4] !== undefined;

        action(modify => {
            modify.setRelationship(from, to, relationship);
            if (twoWay) {
                modify.setRelationship(to, from, relationship);
            }
        });
    },
    examples: [
        'Player 1 is an enemy of player 2.',
        'Player 3 is an ally of player 1, and vice versa.',
    ],
};