export type NotificationErrorParams = {
  message: string;
  context: string;
};

export class Notification {
  private errors: NotificationErrorParams[] = [];

  addError(error: NotificationErrorParams) {
    this.errors.push(error);
  }

  hasErrors(): boolean {
    return this.errors.length > 0;
  }

  getErrors(): NotificationErrorParams[] {
    return this.errors;
  }

  messages(context?: string): string {
    let message = '';

    this.errors.forEach((error) => {
      if (context === undefined || error.context === context) {
        message += `${error.context}: ${error.message}, `;
      }
    });

    return message.slice(0, -2);
  }
}
