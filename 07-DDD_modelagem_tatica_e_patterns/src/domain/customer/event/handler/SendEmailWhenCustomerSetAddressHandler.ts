import { EventHandlerInterface } from "../../../@shared";
import { CustomerSetAddressEvent } from "../CustomerSetAddressEvent";

export class SendEmailCustomerSetAddressHandler implements EventHandlerInterface<CustomerSetAddressEvent> {
  handle(event: CustomerSetAddressEvent): void {
    console.log('Customer Set Address Event', event);
    console.log(`Endereço do cliente: ${event.eventData.id}, ${event.eventData.name} alterado para: ${event.eventData.address.street}, ${event.eventData.address.number}, ${event.eventData.address.city}, ${event.eventData.address.state}, ${event.eventData.address.zipCode}`);
  }
}
