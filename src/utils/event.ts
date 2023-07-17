import { GameEvent } from "../types/GameEvent";

export function emitEvent(
  emitter: Phaser.Events.EventEmitter,
  event: GameEvent
) {
  switch (event.type) {
    case "chest-found":
    case "game-completed":
    case "player-move":
    case "hide-text-dialog":
      emitter.emit(event.type);
      break;
    case "show-text-dialog":
      emitter.emit(event.type, event.data);
      break;
    default:
      console.warn("Unknown event", event);
      break;
  }
}

type OnParams = Parameters<Phaser.Events.EventEmitter["on"]>;
export function attachListener(
  emitter: Phaser.Events.EventEmitter,
  eventType: GameEvent["type"],
  fn: OnParams[1],
  ctx: OnParams[2]
) {
  emitter.on(eventType, fn, ctx);
}

export function detachListener(
  emitter: Phaser.Events.EventEmitter,
  eventType: GameEvent["type"],
  fn: Parameters<Phaser.Events.EventEmitter["removeListener"]>[1]
) {
  emitter.removeListener(eventType, fn);
}
