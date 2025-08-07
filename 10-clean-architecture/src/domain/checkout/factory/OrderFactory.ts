import { Order, OrderItem } from "../entity";

interface OrderFactoryParams {
  id: string;
  customerId: string;
  items: {
    id: string;
    name: string;
    quantity: number;
    price: number;
    productId: string;
  }[];
}

export class OrderFactory {
  public static create(params: OrderFactoryParams): Order {
    const items = params.items.map(item => {
      return new OrderItem(
        item.id,
        item.name,
        item.price,
        item.quantity,
        item.productId
      );
    });

    return new Order(params.id, params.customerId, items);
  }
}
