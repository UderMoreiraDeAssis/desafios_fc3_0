import { EventInterface } from "./EventInterface";

export interface EventHandlerInterface<T extends EventInterface=EventInterface> {
  handle(event: T): void;
}
