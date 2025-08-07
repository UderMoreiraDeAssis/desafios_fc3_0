import { Customer } from "../../customer";
import { Order, OrderItem } from "../entity";
import { OrderService } from "./OrderService";

describe('Order service unit tests', () => {
  it('should place an order', () => {
    const customer = new Customer("customer1", "Customer 1");
    const item1 = new OrderItem("order1", "Item 1", 10, 1, "product1");

    const order = OrderService.placeOrder(customer, [item1]);

    expect(customer.rewardPoints).toBe(5);
    expect(order.total()).toBe(10);
  });

  it('should get total of all orders', () => {
    const item1 = new OrderItem("order1", "Item 1", 100, 1, "product1");
    const item2 = new OrderItem("order2", "Item 2", 200, 2, "product2");

    const order1 = new Order("order1", "Customer 1", [item1]);
    const order2 = new Order("order2", "Customer 2", [item2]);

    const total = OrderService.total([order1, order2]);

    expect(total).toBe(500);
  });
});
