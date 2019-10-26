import { Relationship } from './Relationship';

export class GameRules {
    constructor() {
        this.turnSequence = [];
        this.startRandomTurnSequence = false;
    }

    public getRelationship(fromPlayer: number, toPlayer: number) {
        const fromRels = this.relationshipMap.get(fromPlayer);
        if (fromRels !== undefined) {
            const toRel = fromRels.get(toPlayer);
            if (toRel !== undefined) {
                return toRel;
            }
        }

        return fromPlayer === toPlayer
            ? Relationship.Self
            : Relationship.Enemy;
    }

    public setRelationship(fromPlayer: number, toPlayer: number, relationship: Relationship) {
        let fromRels = this.relationshipMap.get(fromPlayer);
        if (fromRels == undefined) {
            fromRels = new Map<number, Relationship>();
            this.relationshipMap.set(fromPlayer, fromRels);
        }

        fromRels.set(toPlayer, relationship);
    }

    private relationshipMap = new Map<number, Map<number, Relationship>>();

    public turnSequence: number[];
    public startRandomTurnSequence: boolean;

    public cellPassRelationRestriction = Relationship.None;
    public cellStopRelationRestriction = Relationship.None;
}