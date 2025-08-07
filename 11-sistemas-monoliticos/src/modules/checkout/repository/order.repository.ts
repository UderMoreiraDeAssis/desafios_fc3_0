import { Id } from "../../@shared/domain/value-object/id.value-object";
import { Order } from "../domain/order.entity";
import { CheckoutGateway } from "../gateway/checkout.gateway";
import { OrderModel } from "./order.model";

function orderModelToOrder(orderModel: OrderModel): Order {
  return new Order({
    id: new Id(orderModel.id),
    status: orderModel.status,
    client: orderModel.client,
    products: orderModel.products,
    invoiceId: orderModel.invoiceId,
  });
}

export class OrderRepository implements CheckoutGateway {
  async addOrder(order: Order): Promise<Order> {
    const { id, status, client, products, invoiceId } = order;

    const orderCreated = await OrderModel.create({
      id: id.id,
      status,
      client,
      products,
      invoiceId,
    });

    return orderModelToOrder(orderCreated);
  }

  async findOrder(id: string): Promise<Order> {
    const orderOnDB = await OrderModel.findByPk(id);
    return orderModelToOrder(orderOnDB);
  }
}
