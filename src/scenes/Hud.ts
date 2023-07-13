import { Scene } from "phaser";
import { Score } from "../ui/Score";
import { attachListener } from "../utils/event";

export class HudScene extends Scene {
  private score!: Score;

  constructor() {
    super("hud-scene");
  }

  create() {
    this.score = new Score(this, 20, 20);
    this.initListeners();
  }

  private initListeners() {
    attachListener(
      this.game.events,
      "chest-loot",
      () => this.score.changeValue("increase", 10),
      this
    );
  }
}
