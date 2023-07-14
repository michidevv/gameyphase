export type GameEndStatus = "win" | "lose";

export type GameEvent =
  | { type: "chest-loot" }
  | { type: "game-end"; data: { status: GameEndStatus } }
  | { type: "attack" }
  | { type: "show-text-dialog"; data: { text: string } }
  | { type: "hide-text-dialog" };
