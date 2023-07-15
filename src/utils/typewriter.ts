import { GameObjects } from "phaser";

let timerEvent: Phaser.Time.TimerEvent | null;
export function animateText(
  target: GameObjects.Text,
  delay = 10
): Promise<void> {
  if (timerEvent) {
    timerEvent.destroy();
    timerEvent = null;
  }
  const message = target.text;
  const invisibleMessage = message.replace(/[^ ]/g, " ");

  target.text = "";

  let visibleText = "";

  return new Promise((resolve) => {
    timerEvent = target.scene.time.addEvent({
      delay,
      loop: true,
      callback() {
        if (target.text === message) {
          timerEvent?.destroy();
          return resolve();
        }

        visibleText += message[visibleText.length];
        const invisibleText = invisibleMessage.substring(visibleText.length);

        target.text = visibleText + invisibleText;
      },
    });
  });
}
