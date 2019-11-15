import { GameDefinition } from '../../definitions';

export function getAllDirections(game: GameDefinition) {
    let directions = new Set<string>();

    for (const [, board] of game.boards) {
        board.appendDirections(directions);
    }

    return directions;
}