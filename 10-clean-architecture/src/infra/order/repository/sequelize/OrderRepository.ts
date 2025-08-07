import { Order, OrderInterface, OrderItem } from "../../../../domain/checkout";
import { OrderItemModel, OrderModel } from "../../db";


export class OrderRepository implements OrderInterface {
  async create(entity: Order): Promise<void> {
    await OrderModel.create({
      id: entity.id,
      customer_id: entity.customerId,
      total: entity.total(),
      items: entity.items.map(item => ({
        id: item.id,
        name: item.name,
        price: item.price,
        quantity: item.quantity,
        product_id: item.productId,
      }))
    }, {
      include: [{ model: OrderItemModel }]
    });
  }
  async update(entity: Order): Promise<void> {
    const sequelize = OrderModel.sequelize;

    await sequelize.transaction(async (transaction) => {
      await OrderItemModel.destroy({
        where: { order_id: entity.id },
        transaction
      });
      const items = entity.items.map(item => ({
        id: item.id,
        name: item.name,
        price: item.price,
        quantity: item.quantity,
        product_id: item.productId,
        order_id: entity.id
      }));
      await OrderItemModel.bulkCreate(items, { transaction });
      await OrderModel.update(
        { total: entity.total() },
        { where: { id: entity.id }, transaction }
      );
    });
  }
  async find(id: string): Promise<Order> {
    const orderModel = await OrderModel.findOne({
      where: { id },
      include: ["items", "customer"]
    });
    const items = orderModel.items.map(item => new OrderItem(
      item.id,
      item.name,
      item.price,
      item.quantity,
      item.product_id
    ));
    return new Order(
      orderModel.id,
      orderModel.customer_id,
      items
    );
  }
  async findAll(): Promise<Order[]> {
    const orderModels = await OrderModel.findAll({
      include: ["items", "customer"]
    });
    return orderModels.map(orderModel => {
      const items = orderModel.items.map(item => new OrderItem(
        item.id,
        item.name,
        item.price,
        item.quantity,
        item.product_id
      ));
      return new Order(
        orderModel.id,
        orderModel.customer_id,
        items
      );
    });
  }
}
