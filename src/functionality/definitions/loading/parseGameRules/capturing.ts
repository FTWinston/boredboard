import { GameRules } from '../../GameRules';
import { Relationship } from '../../Relationship';
import { parseRelationship } from '../parsePieceActions/parseRelationship';

export const capturing/*: ISentenceParser<GameRules, IGameRulesOptions>*/ = {
    type: 'standard' as 'standard', // if the above type definition worked properly, this assertion wouldn't be needed
    expressionText: `A moving piece captures (?:a|an|any) (.*)pieces? in (?:the )? cells? it (starts from|stops in|moves through)`,
    parseMatch: (
        match: RegExpExecArray,
        action: (action: (modify: GameRules) => void) => void
    ) => {

        const relation = parseRelationship(match[1]);
        if (relation === Relationship.None) {
            return;
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