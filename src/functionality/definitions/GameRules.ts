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
        if (fromRels === undefined) {
            fromRels = new Map<number, Relationship>();
            this.relationshipMap.set(fromPlayer, fromRels);
        }

        fromRels.set(toPlayer, relationship);
    }

    public getPlayersByRelationship(fromPlayer: number, relationship: Relationship) {
        const fromRels = this.relationshipMap.get(fromPlayer);

        const results: number[] = [];

        if (fromRels === undefined) {
            return results;
        }

        for (const [toPlayer, testRelationship] of fromRels) {
            if (testRelationship === relationship) {
                results.push(toPlayer);
            }
        }

        return results;
    }

    private readonly relationshipMap = new Map<number, Map<number, Relationship>>(); // from player, to player, relationship

    
    public turnSequence: number[];
    public startRandomTurnSequence: boolean;

    public cellPassRelationRestriction = Relationship.None;
    public cellStopRelationRestriction = Relationship.None;
    
    public capturePassRelations = Relationship.None;
    public captureStartRelations = Relationship.None;
    public captureStopRelations = Relationship.None;


    public setCaptureDestination(player: number, board: string, cell: string) {
        this.playerCaptureDestinations.set(player, [board, cell]);
    }

    public getCaptureDestination(player: number): [string, string] {
        const location = this.playerCaptureDestinations.get(player);

        return location === undefined
            ? ['', '']
            : location;
    }

    private readonly playerCaptureDestinations = new Map<number, [string, string]>();
}