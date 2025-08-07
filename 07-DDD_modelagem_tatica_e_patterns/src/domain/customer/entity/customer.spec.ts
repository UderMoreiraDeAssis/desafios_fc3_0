
import { EventDispatcher } from "../../@shared";
import { CustomerCreatedEvent, CustomerSetAddressEvent, SendEmailCustomerIsCreatedHandler, SendEmailCustomerSetAddressHandler, SendQueueCustomerIsCreatedHandler } from "../event";
import { Address } from "../valueObject";
import { Customer } from "./Customer";

describe('Customer unit tests', () => {
  it('should throw error when id is empty', () => {
    expect(() => {
      new Customer('', 'John Doe');
    }).toThrow('Id is required');
  });

  it('should throw error when name is empty', () => {
    expect(() => {
      new Customer('123', '');
    }).toThrow('Name is required');
  });

  it('should throw error when address is undefined when you activate a customer', () => {
    expect(() => {
      const customer = new Customer('123', 'John Doe');
      customer.activate();
    }).toThrow('Address is mandatory to activate the customer');
  });

  it('should change name', () => {
    const customer = new Customer('123', 'John Doe');
    customer.changeName('Jane Doe');
    expect(customer.name).toBe('Jane Doe');
  });

  it('should activate customer', () => {
    const customer = new Customer('123', 'John Doe');
    const address = new Address("Street 1", 100, "City 1", "State 1", "ZipCode 1");
    customer.setAddress(address);

    customer.activate();
    expect(customer.isActive()).toBe(true);
  });

  it('should deactivate customer', () => {
    const customer = new Customer('123', 'John Doe');

    customer.deactivate();
    expect(customer.isActive()).toBe(false);
  });

  it('should add reward points', () => {
    const customer = new Customer('123', 'John Doe');
    expect(customer.rewardPoints).toBe(0);

    customer.addRewardPoints(10);
    expect(customer.rewardPoints).toBe(10);

    customer.addRewardPoints(10);
    expect(customer.rewardPoints).toBe(20);
  });

  it('should notify event handlers when customer is created', () => {
    const eventDispatcher = new EventDispatcher();
    const eventHandlerSendEmail = new SendEmailCustomerIsCreatedHandler();
    const eventHandlerSendQueue = new SendQueueCustomerIsCreatedHandler();
    const spyEventHandlerSendEmail = jest.spyOn(eventHandlerSendEmail, 'handle');
    const spyEventHandlerSendQueue = jest.spyOn(eventHandlerSendQueue, 'handle');

    eventDispatcher.register('CustomerCreatedEvent', eventHandlerSendEmail);
    eventDispatcher.register('CustomerCreatedEvent', eventHandlerSendQueue);

    expect(eventDispatcher.getEventHandlers['CustomerCreatedEvent'][0]).toMatchObject(eventHandlerSendEmail);
    expect(eventDispatcher.getEventHandlers['CustomerCreatedEvent'][1]).toMatchObject(eventHandlerSendQueue);

    const customer = new Customer('123', 'John Doe');

    const customerCreatedEvent = new CustomerCreatedEvent(customer);

    eventDispatcher.notify(customerCreatedEvent);

    expect(spyEventHandlerSendEmail).toHaveBeenCalledTimes(1);
    expect(spyEventHandlerSendQueue).toHaveBeenCalledTimes(1);
  });

  it('should notify event handlers when set address', () => {
    const eventDispatcher = new EventDispatcher();
    const eventHandler = new SendEmailCustomerSetAddressHandler();
    const spyEventHandler = jest.spyOn(eventHandler, 'handle');

    eventDispatcher.register('CustomerSetAddressEvent', eventHandler);

    expect(eventDispatcher.getEventHandlers['CustomerSetAddressEvent'][0]).toMatchObject(eventHandler);

    const customer = new Customer('123', 'John Doe');
    const address = new Address("Street 1", 100, "City 1", "State 1", "ZipCode 1");
    customer.setAddress(address);

    const customerSetAddressEvent = new CustomerSetAddressEvent(customer);

    eventDispatcher.notify(customerSetAddressEvent);

    expect(spyEventHandler).toHaveBeenCalledTimes(1);
  });
});
