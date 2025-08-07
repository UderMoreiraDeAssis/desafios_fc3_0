import { Notification } from "./Notification";

describe('Unit tests for notifications', () => {
  it('should create errors', () => {
    const notification = new Notification();
    const error1 = {
      message: 'Error message 1',
      context: 'customer',
    }

    const error2 = {
      message: 'Error message 2',
      context: 'customer',
    };

    notification.addError(error1);
    expect(notification.messages('customer')).toBe('customer: Error message 1');

    notification.addError(error2);
    expect(notification.messages('customer')).toBe('customer: Error message 1, customer: Error message 2');
  });

  it('should get errors contexts', () => {
    const notification = new Notification();
    const error1 = {
      message: 'Error message 1',
      context: 'customer',
    }

    const error2 = {
      message: 'Error message 2',
      context: 'product',
    };

    notification.addError(error1);
    notification.addError(error2);

    expect(notification.messages('customer')).toBe('customer: Error message 1');
  });

  it('should get all errors', () => {
    const notification = new Notification();
    const error1 = {
      message: 'Error message 1',
      context: 'customer',
    }

    const error2 = {
      message: 'Error message 2',
      context: 'product',
    };

    notification.addError(error1);
    notification.addError(error2);

    expect(notification.messages()).toBe('customer: Error message 1, product: Error message 2');
  });

  it('should check if has errors', () => {
    const notification = new Notification();
    const error = {
      message: 'Error message',
      context: 'customer',
    }

    notification.addError(error);

    expect(notification.hasErrors()).toBe(true);
  });

  it('should get all errors params', () => {
    const notification = new Notification();
    const error = {
      message: 'Error message',
      context: 'customer',
    }

    notification.addError(error);

    expect(notification.getErrors()).toEqual([error]);
  });
});
