import { GameRules } from '../../GameRules';
import { Relationship } from '../../Relationship';

export const moveRestrictions/*: ISentenceParser<GameRules, IGameRulesOptions>*/ = {
    type: 'standard' as 'standard', // if the above type definition worked properly, this assertion wouldn't be needed
    expressionText: `A piece cannot (enter|move through|stop in) a cell containing (another|a friendly|an enemy|an allied|another player's|the same player's) pieces?`,
    parseMatch: (
        match: RegExpExecArray,
        action: (action: (modify: GameRules) => void) => void
    ) => {
        let relation = Relationship.None;

        // TODO: use standard "piece filter" code here. Don't need options hard-coded in regex.
        switch (match[2]) {
            case 'a friendly':
                relation = Relationship.Self | Relationship.Ally;
                break;
            case 'an enemy':
                relation = Relationship.Enemy;
                break;
            case 'an allied':
                relation = Relationship.Ally;
                break;
            case `the same player's`:
                relation = Relationship.Self | Relationship.Ally;
                break;
            case `another player's`:
                relation = Relationship.Ally | Relationship.Enemy;
                break;
            default:
                relation = Relationship.Self | Relationship.Ally | Relationship.Enemy;
                break;
        }
        
        let result: (modify: GameRules) => void;
        switch (match[1]) {
            case 'stop in':
                result = modify => modify.cellStopRelationRestriction |= relation;
                break;
            case 'move through':
                result = modify => modify.cellPassRelationRestriction |= relation;
                break;
            case 'enter':
                result = modify => {
                    modify.cellStopRelationRestriction |= relation;
                    modify.cellPassRelationRestriction |= relation;
                };
                break;
            default:
                return;
        }
        action(result);
    },
    examples: [
        'A piece cannot stop in a cell containing a friendly piece.',
        'A piece cannot enter a cell containing another piece.',
        'A piece cannot move through cell containing an enemy piece.',
        'A piece cannot enter in a cell containing an allied piece.',
        `A piece cannot stop in a cell containing another player's piece.`,
        `A piece cannot enter a cell containing the same player's piece.`,
    ],
};