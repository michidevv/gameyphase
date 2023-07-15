import { Scene } from "phaser";
import { Score } from "../ui/Score";
import { attachListener, detachListener, emitEvent } from "../utils/event";
import { Text } from "../ui/Text";
import { SCENES } from "./scenes";
import { animateText } from "../utils/typewriter";
import { COLORS } from "../ui/colors";
import { TextKeys, getTranslation } from "../utils/i18n";

const TEXT_DIALOG_CONF = {
  padding: 12,
  height: 300,
};

export class HudScene extends Scene {
  private score!: Score;
  private textDialog?: { textElm: Text; dialog: Phaser.GameObjects.Graphics };

  constructor() {
    super(SCENES.hud);
  }

  private chestLootHandler = () => {
    this.score.changeValue("increase", 1);
    if (this.score.getValue() === 4) {
      emitEvent(this.game.events, {
        type: "game-completed",
      });
    }
  };
  private gameCompletedHandler = () => {
    this.cameras.main.setBackgroundColor("rgba(0,0,0,0.6)");
    this.game.scene.pause(SCENES.playground);
    new Text(
      this,
      this.game.scale.width / 2,
      this.game.scale.height * 0.2,
      getTranslation("game_completed"),
      { fontSize: 28 }
    )
      .setAlign("center")
      .setOrigin(0.5);

    this.input.once("pointerdown", () => {
      detachListener(this.game.events, "chest-found", this.chestLootHandler);
      detachListener(
        this.game.events,
        "game-completed",
        this.gameCompletedHandler
      );
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
      this.textDialog = undefined;
      this.scene.get(SCENES.playground).scene.restart();
      this.scene.restart();
    });
  };

  private showTextDialogHandler = ({ text }: { text: string }) => {
    const copy = getTranslation(text as TextKeys);
    if (this.textDialog) {
      this.textDialog.textElm.text = copy;

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
          copy,
          {
            fontSize: 24,
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
    attachListener(
      this.game.events,
      "chest-found",
      this.chestLootHandler,
      this
    );
    attachListener(
      this.game.events,
      "game-completed",
      this.gameCompletedHandler,
      this
    );
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
