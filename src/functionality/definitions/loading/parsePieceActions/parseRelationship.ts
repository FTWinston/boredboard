import { Relationship } from '../../Relationship';

export function parseRelationship(text: string): Relationship {
    switch (text.trim()) {
        case 'friendly':
            return Relationship.Self | Relationship.Ally;
        case 'enemy':
            return Relationship.Enemy;
        case 'allied':
            return Relationship.Ally;
        case `other player's`:
            return Relationship.Self | Relationship.Ally;
        case `of the same player's`:
            return Relationship.Ally | Relationship.Enemy;
        case '':
            return Relationship.Self | Relationship.Ally | Relationship.Enemy;
        default:
            return Relationship.None;
    }
}