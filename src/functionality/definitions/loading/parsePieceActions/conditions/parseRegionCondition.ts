import { IParserError } from 'natural-configuration';
import { RegionCondition } from '../../../conditions/RegionCondition';
import { parseRelationship } from '../parseRelationship';
import { Relationship } from '../../../Relationship';

const regionExpression = new RegExp('^is in (?:a |an |the |)?(.+?) (.+)$')

export function parseRegionCondition(
    conditionText: string,
    error: (error: IParserError) => void,
    startIndex: number,
) {
    const match = conditionText.match(regionExpression);
    if (match === null) {
        error({
            startIndex,
            length: conditionText.length,
            message: `Unrecognised condition: ${conditionText} ... expected e.g. "is in the enemy endzone" or "is in a friendly promotion area"`,
        })
        return null;
    }

    const relationshipText = match[1];
    const regionName = match[2];

    const relationship = parseRelationship(relationshipText);
    if (relationship === Relationship.None) {
        error({
            startIndex: startIndex + conditionText.indexOf(relationshipText),
            length: relationshipText.length,
            message: `Unrecognised relationship: ${relationshipText}`,
        })
        return null;
    }

    return new RegionCondition(regionName, relationship);
}