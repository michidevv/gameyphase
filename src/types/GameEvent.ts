export type GameEvent =
  | { type: "chest-found" }
  | { type: "game-completed" }
  | { type: "player-move" }
  | { type: "show-text-dialog"; data: { text: string } }
  | { type: "hide-text-dialog" };
