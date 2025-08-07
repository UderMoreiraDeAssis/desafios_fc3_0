import { EventHandlerInterface } from "../../../@shared";
import { ProductCreatedEvent } from "../ProductCreatedEvent";

export class SendEmailWhenProductIsCreatedHandler implements EventHandlerInterface<ProductCreatedEvent> {
    handle(event: ProductCreatedEvent): void {
      console.log('Product Event', event);
      console.log(`Send email when product is created to ....`);
    }
}
