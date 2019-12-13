import { Relationship } from './Relationship';
import { IPlayerAction } from '../instances/IPlayerAction';
import { PieceFilter } from '../instances/functions/getMatchingPieces';
import { wouldAnyBeThreatenedAfter, wouldAllBeThreatenedAfter } from '../instances/functions/isThreatened';
import { GameDefinition } from './GameDefinition';
import { IGameState } from '../instances/IGameState';

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
            if ((testRelationship & relationship) !== 0) {
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


    public getAnyThreatenedPieceFilter: (player: number) => PieceFilter[]
        = () => []; // TODO: populate these when parsing rules

    public getAllThreatenedPieceFilter: (player: number) => PieceFilter[]
        = () => []; // TODO: populate these when parsing rules

    public filterActions(game: GameDefinition, state: IGameState, player: number, actions: IPlayerAction[]) {
        const anyThreatenedFilters = this.getAnyThreatenedPieceFilter(player);

        const allThreatenedFilters = this.getAllThreatenedPieceFilter(player);

        return actions.filter(action => {
            for (const filter of anyThreatenedFilters) {
                if (wouldAnyBeThreatenedAfter(game, state, action, filter)) {
                    return false;
                }
            }

            for (const filter of allThreatenedFilters) {
                if (wouldAllBeThreatenedAfter(game, state, action, filter)) {
                    return false;
                }
            }

            return true;
        });
    }
}