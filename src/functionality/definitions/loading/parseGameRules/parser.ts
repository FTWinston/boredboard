import { ConfigurationParser } from 'natural-configuration';
import { BoardDefinition } from '../../BoardDefinition';
import { PieceDefinition } from '../../PieceDefinition';
import { GameRules } from '../../GameRules';
import { turnOrder } from './turnOrder';
import { cellOccupancy } from './cellOccupancy';

export interface IGameRulesOptions {
    numPlayers: number;
    boards: ReadonlyMap<string, BoardDefinition>;
    pieces: ReadonlyMap<string, PieceDefinition>;
}

export const parser = new ConfigurationParser<GameRules, IGameRulesOptions>([
    turnOrder,
    cellOccupancy,
]);