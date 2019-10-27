import { GameRules } from '../../GameRules';
import { Relationship } from '../../Relationship';

export const capturing/*: ISentenceParser<GameRules, IGameRulesOptions>*/ = {
    type: 'standard' as 'standard', // if the above type definition worked properly, this assertion wouldn't be needed
    expressionText: `A moving piece captures any (friendly |enemy |allied |other player's |of the same player's )?pieces? in (?:the )? cells? it (starts from|stops in|moves through)`,
    parseMatch: (
        match: RegExpExecArray,
        action: (action: (modify: GameRules) => void) => void
    ) => {

        let relation = Relationship.None;
        
        switch (match[1]) {
            case 'friendly ':
                relation = Relationship.Self | Relationship.Ally;
                break;
            case 'enemy ':
                relation = Relationship.Enemy;
                break;
            case 'allied ':
                relation = Relationship.Ally;
                break;
            case `other player's `:
                relation = Relationship.Self | Relationship.Ally;
                break;
            case `of the same player's `:
                relation = Relationship.Ally | Relationship.Enemy;
                break;
            default:
                relation = Relationship.Self | Relationship.Ally | Relationship.Enemy;
                break;
        }
        
        let result: (modify: GameRules) => void;
        switch (match[2]) {
            case 'starts from':
                result = modify => modify.captureStartRelations |= relation;
                break;
            case 'stops in':
                result = modify => modify.captureStopRelations |= relation;
                break;
            case 'moves through':
                result = modify => modify.capturePassRelations |= relation;
                break;
            default:
                return;
        }
        action(result);
    },
    examples: [
        `A moving piece captures any enemy piece in the cell it stops in.`,
        `A moving piece captures any friendly piece in cells it moves through.`,
        `A moving piece captures any allied piece in the cell it starts from.`,
        `A moving piece captures any other player's piece in the cell it stops in.`,
        `A moving piece captures any of the same player's pieces in the cell it stops in.`,
        `A moving piece captures any piece in the cells it moves through.`,
    ],
};