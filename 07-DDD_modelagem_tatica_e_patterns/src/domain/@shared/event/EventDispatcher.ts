import { EventDispatcherInterface } from "./EventDispatcherInterface";
import { EventHandlerInterface } from "./EventHandlerInterface";
import { EventInterface } from "./EventInterface";

export class EventDispatcher implements EventDispatcherInterface {
  private eventHandlers: { [eventName: string]: EventHandlerInterface[] } = {};

  get getEventHandlers(): { [eventName: string]: EventHandlerInterface[] } {
    return this.eventHandlers;
  }
  notify(event: EventInterface): void {
    const eventName = event.constructor.name;
    if (this.eventHandlers[eventName]) {
      this.eventHandlers[eventName].forEach((handler) => handler.handle(event));
    }
  }
  register(event: string, handler: EventHandlerInterface<EventInterface>): void {
    if (!this.eventHandlers[event]) {
      this.eventHandlers[event] = [];
    }
    this.eventHandlers[event].push(handler);
  }
  unregister(event: string, handler: EventHandlerInterface<EventInterface>): void {
    if (this.eventHandlers[event]) {
      const index = this.eventHandlers[event].indexOf(handler);
      if (index !== -1) {
        this.eventHandlers[event].splice(index, 1);
      }
    }
  }
  unregisterAll(): void {
    this.eventHandlers = {};
  }
}
