import { EventHandlerInterface } from "../../../@shared";
import { CustomerCreatedEvent } from "../CustomerCreatedEvent";

export class SendQueueCustomerIsCreatedHandler implements EventHandlerInterface<CustomerCreatedEvent> {
  handle(event: CustomerCreatedEvent): void {
    console.log('Customer Event', event);
    console.log(`Esse é o primeiro console.log do evento: CustomerCreated`);
  }
}
