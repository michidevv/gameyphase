import { GameObjects } from "phaser";

export function animateText(
  target: GameObjects.Text,
  delay = 10
): Promise<void> {
  const message = target.text;
  const invisibleMessage = message.replace(/[^ ]/g, " ");

  target.text = "";

  let visibleText = "";

  return new Promise((resolve) => {
    const timer = target.scene.time.addEvent({
      delay,
      loop: true,
      callback() {
        if (target.text === message) {
          timer.destroy();
          return resolve();
        }

        visibleText += message[visibleText.length];
        const invisibleText = invisibleMessage.substring(visibleText.length);

        target.text = visibleText + invisibleText;
      },
    });
  });
}
