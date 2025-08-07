import { EventHandlerInterface } from "../../../@shared";
import { CustomerCreatedEvent } from "../CustomerCreatedEvent";

export class SendEmailCustomerIsCreatedHandler implements EventHandlerInterface<CustomerCreatedEvent> {
  handle(event: CustomerCreatedEvent): void {
    console.log('Customer Event', event);
    console.log(`Esse é o segundo console.log do evento: CustomerCreated`);
  }
}
