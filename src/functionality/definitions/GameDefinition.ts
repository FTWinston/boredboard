import { BoardDefinition } from './BoardDefinition';
import { PieceDefinition } from './PieceDefinition';
import { IGameDefinition } from '../../data/IGameDefinition';
import { GameRules } from './GameRules';
import { loadBoards } from './loading/loadBoards';
import { loadPieces } from './loading/loadPieces';
import { parseGameRules } from './loading/parseGameRules';

export class GameDefinition {
    public readonly rules: Readonly<GameRules>;
    public readonly boards: ReadonlyMap<string, BoardDefinition>;
    public readonly pieces: ReadonlyMap<string, PieceDefinition>;

    constructor(data: IGameDefinition) {
        let allAllowedDirections: ReadonlySet<string>;

        [this.boards, allAllowedDirections] = loadBoards(this, data);

        this.pieces = loadPieces(this, data, allAllowedDirections);

        const rulesResult = parseGameRules(data.rules, this.boards, this.pieces, 2 /* TODO: where is this specified, if not in the rules? */);

        if (rulesResult.success) {
            this.rules = rulesResult.rules;
        }
        else {
            // TODO: need a better approach than just logging to console
            console.log(`failed to parse game rules`, rulesResult.errors);

            this.rules = new GameRules();
        }
    }
}