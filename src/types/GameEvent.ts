export type GameEvent =
  | { type: "chest-found" }
  | { type: "game-completed" }
  | { type: "attack" }
  | { type: "show-text-dialog"; data: { text: string } }
  | { type: "hide-text-dialog" };
