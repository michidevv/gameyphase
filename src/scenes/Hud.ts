import { Scene } from "phaser";
import { Score } from "../ui/Score";
import { attachListener, detachListener, emitEvent } from "../utils/event";
import { Text } from "../ui/Text";
import { GameEndStatus } from "../types/GameEvent";
import { SCENES } from "./scenes";

export class HudScene extends Scene {
  private score!: Score;
  private chestLootHandler = () => {
    this.score.changeValue("increase", 10);
    // Move out to config
    if (this.score.getValue() === 40) {
      emitEvent(this.game.events, {
        type: "game-end",
        data: { status: "win" },
      });
    }
  };
  private gameEndHandler = ({ status }: { status: GameEndStatus }) => {
    this.cameras.main.setBackgroundColor("rgba(0,0,0,0.6)");
    this.game.scene.pause(SCENES.playground);
    new Text(
      this,
      this.game.scale.width / 3,
      this.game.scale.height * 0.2,
      status === "lose"
        ? `Game Over!\nPress 'r' to restart`
        : `You won!\nPress 'r' to restart`
    )
      .setAlign("center")
      .setColor(status === "lose" ? "#fd0000" : "#ffffff");

    this.input.keyboard?.on("keydown-R", () => {
      detachListener(this.game.events, "chest-loot", this.chestLootHandler);
      detachListener(this.game.events, "game-end", this.gameEndHandler);
      this.scene.get(SCENES.playground).scene.restart();
      this.scene.restart();
    });
  };

  constructor() {
    super(SCENES.hud);
  }

  create() {
    this.score = new Score(this, 20, 20);
    this.initListeners();
  }

  private initListeners() {
    attachListener(this.game.events, "chest-loot", this.chestLootHandler, this);
    attachListener(this.game.events, "game-end", this.gameEndHandler, this);
  }
}
