export const rules = `
Players take alternate turns, starting with player 1.

A piece cannot enter a cell containing a friendly piece.
A piece cannot move through a cell containing another piece.

A moving piece captures any enemy piece in the cell it stops in.

When a piece is captured, move it to the capturing player's hand.

Disallow any move that threatens a friendly king.
If a player cannot move and their king is threatened, end the game with their loss.
If a player cannot move and their king is not threatened, end the game with a draw.
If a king is threatened at the start of a turn, say "Check".
`;