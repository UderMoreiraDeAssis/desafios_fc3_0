import { v4 as uuid } from 'uuid';
import { OrderFactory } from './OrderFactory';

describe('Order factory unit test', () => {
  it('should create an order', () => {
    const orderParams = {
      id: uuid(),
      customerId: uuid(),
      items: [
        {
          id: uuid(),
          name: "Item 1",
          quantity: 1,
          price: 100,
          productId: uuid()
        }
      ]
    };

    const order = OrderFactory.create(orderParams);

    expect(order.id).toBe(orderParams.id);
    expect(order.customerId).toBe(orderParams.customerId);
    expect(order.items.length).toBe(1);
  });
});
