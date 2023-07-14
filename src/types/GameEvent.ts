export type GameEvent =
  | { type: "chest-loot" }
  | { type: "game-end"; data: { status: GameEndStatus } }
  | { type: "attack" };

export type GameEndStatus = "win" | "lose";
