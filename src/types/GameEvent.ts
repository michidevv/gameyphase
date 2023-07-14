export type GameEvent =
  | { type: "chest-loot" }
  | { type: "game-end"; data: unknown }
  | { type: "attack" };
