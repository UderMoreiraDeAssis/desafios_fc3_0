import { NotificationErrorParams } from "./Notification";

export class NotificationError extends Error {
  constructor(public errors: NotificationErrorParams[]) {
    super(errors.map((error) => error.message).join(', '));
  }
}
