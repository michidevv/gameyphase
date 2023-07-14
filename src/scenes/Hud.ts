import { Scene } from "phaser";
import { Score } from "../ui/Score";
import { attachListener, detachListener, emitEvent } from "../utils/event";
import { Text } from "../ui/Text";
import { GameEndStatus } from "../types/GameEvent";
import { SCENES } from "./scenes";
import { animateText } from "../utils/typewriter";
import { COLORS } from "../ui/colors";

const TEXT_DIALOG_CONF = {
  padding: 12,
  height: 240,
};

export class HudScene extends Scene {
  private score!: Score;
  private textDialog?: { textElm: Text; dialog: Phaser.GameObjects.Graphics };

  constructor() {
    super(SCENES.hud);
  }

  private chestLootHandler = () => {
    this.score.changeValue("increase", 10);
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

    this.input.keyboard?.once("keydown-R", () => {
      detachListener(this.game.events, "chest-loot", this.chestLootHandler);
      detachListener(this.game.events, "game-end", this.gameEndHandler);
      detachListener(
        this.game.events,
        "show-text-dialog",
        this.showTextDialogHandler
      );
      detachListener(
        this.game.events,
        "hide-text-dialog",
        this.hideTextDialogHandler
      );
      this.scene.get(SCENES.playground).scene.restart();
      this.scene.restart();
    });
  };

  private showTextDialogHandler = ({ text }: { text: string }) => {
    if (this.textDialog) {
      this.textDialog.textElm.text = text;

      this.textDialog.dialog.setVisible(true);
      this.textDialog.textElm.setVisible(true);
    } else {
      const x = TEXT_DIALOG_CONF.padding;
      const width =
        this.cameras.main.displayWidth - TEXT_DIALOG_CONF.padding * 2;
      const y =
        this.cameras.main.displayHeight -
        TEXT_DIALOG_CONF.height -
        TEXT_DIALOG_CONF.padding;

      this.textDialog = {
        dialog: this.add
          .graphics()
          .fillStyle(COLORS.darkGrey, 0.8)
          .fillRect(x + 1, y + 1, width - 1, TEXT_DIALOG_CONF.height - 1)
          .lineStyle(3, COLORS.yellowGrey, 0.9)
          .strokeRect(x, y, width, TEXT_DIALOG_CONF.height),
        textElm: new Text(
          this,
          x + TEXT_DIALOG_CONF.padding,
          y + TEXT_DIALOG_CONF.padding,
          text,
          {
            fontSize: 18,
            wordWrap: { width: width - TEXT_DIALOG_CONF.padding * 2 },
          }
        ),
      };
    }

    animateText(this.textDialog.textElm);
  };

  private hideTextDialogHandler() {
    this.textDialog?.dialog.setVisible(false);
    this.textDialog?.textElm.setVisible(false);
  }

  private initListeners() {
    attachListener(this.game.events, "chest-loot", this.chestLootHandler, this);
    attachListener(this.game.events, "game-end", this.gameEndHandler, this);
    attachListener(
      this.game.events,
      "show-text-dialog",
      this.showTextDialogHandler,
      this
    );
    attachListener(
      this.game.events,
      "hide-text-dialog",
      this.hideTextDialogHandler,
      this
    );
  }

  create() {
    this.score = new Score(this, 20, 20);
    this.initListeners();
  }
}
