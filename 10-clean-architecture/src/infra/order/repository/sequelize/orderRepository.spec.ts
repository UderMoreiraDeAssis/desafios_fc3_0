import { Sequelize } from "sequelize-typescript";
import { OrderRepository } from "./OrderRepository";
import { CustomerModel, CustomerRepository } from "../../../customer";
import { OrderItemModel, OrderModel } from "../../db";
import { Address, Customer } from "../../../../domain/customer";
import { ProductRepository } from "../../../product/repository/sequelize/ProductRepository";
import { Product } from "../../../../domain/product";
import { Order, OrderItem } from "../../../../domain/checkout";
import { ProductModel } from "../../../product";

describe('Order repository test', () => {
  let sequelize: Sequelize;

  beforeEach(async () => {
    sequelize = new Sequelize({
      dialect: 'sqlite',
      storage: ':memory:',
      logging: false,
      sync: { force: true },
    });

    sequelize.addModels([CustomerModel, OrderModel, OrderItemModel, ProductModel]);
    await sequelize.sync();
  });

  afterEach(async () => {
    await sequelize.close();
  });

  it('should create order', async () => {
    const customerRepository = new CustomerRepository();
    const customer = new Customer("customerId", "John Doe");
    const address = new Address("street", 1, "city", "state", "zipCode");
    customer.setAddress(address);
    await customerRepository.create(customer);

    const productRepository = new ProductRepository();
    const product = new Product("productId", "Product 1", 10);
    await productRepository.create(product);

    const orderItem = new OrderItem(
      "orderItemId",
      product.name,
      product.price,
      2,
      product.id
    );

    const order = new Order("orderId", customer.id, [orderItem]);

    const orderRepository = new OrderRepository();
    await orderRepository.create(order);

    const orderModel = await OrderModel.findOne({
      where: { id: order.id },
      include: ["items"]
    });

    expect(orderModel.toJSON()).toStrictEqual({
      id: "orderId",
      customer_id: "customerId",
      total: order.total(),
      items: [
        {
          id: orderItem.id,
          name: orderItem.name,
          price: orderItem.price,
          quantity: orderItem.quantity,
          order_id: "orderId",
          product_id: "productId"
        }
      ]
    });
  });

  it('should update order', async () => {
    const customerRepository = new CustomerRepository();
    const customer = new Customer("customerId", "John Doe");
    const address = new Address("street", 1, "city", "state", "zipCode");
    customer.setAddress(address);
    await customerRepository.create(customer);

    const productRepository1 = new ProductRepository();
    const product1 = new Product("productId1", "Product 1", 10);
    await productRepository1.create(product1);

    const orderItem1 = new OrderItem(
      "orderItemId1",
      product1.name,
      product1.price,
      2,
      product1.id
    );

    const order = new Order("orderId1", customer.id, [orderItem1]);

    const orderRepository = new OrderRepository();
    await orderRepository.create(order);

    const orderModel = await OrderModel.findOne({
      where: { id: order.id },
      include: ["items"]
    });

    expect(orderModel.toJSON()).toStrictEqual({
      id: "orderId1",
      customer_id: "customerId",
      total: order.total(),
      items: [
        {
          id: orderItem1.id,
          name: orderItem1.name,
          price: orderItem1.price,
          quantity: orderItem1.quantity,
          order_id: "orderId1",
          product_id: "productId1"
        }
      ]
    });

    const productRepository2 = new ProductRepository();
    const product2 = new Product("productId2", "Product 2", 20);
    await productRepository2.create(product2);

    const orderItem2 = new OrderItem(
      "orderItemId2",
      product2.name,
      product2.price,
      1,
      product2.id
    );

    order.addItem(orderItem2);
    await orderRepository.update(order);

    const orderModelUpdated = await OrderModel.findOne({
      where: { id: "orderId1" },
      include: ["items"]
    });

    expect(orderModelUpdated.toJSON()).toStrictEqual({
      id: "orderId1",
      customer_id: "customerId",
      total: order.total(),
      items: [
        {
          id: orderItem1.id,
          name: orderItem1.name,
          price: orderItem1.price,
          quantity: orderItem1.quantity,
          order_id: "orderId1",
          product_id: "productId1"
        },
        {
          id: orderItem2.id,
          name: orderItem2.name,
          price: orderItem2.price,
          quantity: orderItem2.quantity,
          order_id: "orderId1",
          product_id: "productId2"
        }
      ]
    });
  });

  it('should find order', async () => {
    const customerRepository = new CustomerRepository();
    const customer = new Customer("customerId", "John Doe");
    const address = new Address("street", 1, "city", "state", "zipCode");
    customer.setAddress(address);
    await customerRepository.create(customer);

    const productRepository = new ProductRepository();
    const product = new Product("productId", "Product 1", 10);
    await productRepository.create(product);

    const orderItem = new OrderItem(
      "orderItemId",
      product.name,
      product.price,
      2,
      product.id
    );

    const order = new Order("orderId", customer.id, [orderItem]);

    const orderRepository = new OrderRepository();
    await orderRepository.create(order);

    const orderModel = await OrderModel.findOne({
      where: { id: order.id },
      include: ["items"]
    });

    expect(orderModel.toJSON()).toStrictEqual({
      id: "orderId",
      customer_id: "customerId",
      total: order.total(),
      items: [
        {
          id: orderItem.id,
          name: orderItem.name,
          price: orderItem.price,
          quantity: orderItem.quantity,
          order_id: "orderId",
          product_id: "productId"
        }
      ]
    });

    const orderFound = await orderRepository.find(order.id);

    expect(orderFound).toStrictEqual(order);
  });

  it('should find all orders', async () => {
    const customerRepository = new CustomerRepository();
    const customer = new Customer("customerId", "John Doe");
    const address = new Address("street", 1, "city", "state", "zipCode");
    customer.setAddress(address);
    await customerRepository.create(customer);

    const productRepository1 = new ProductRepository();
    const product1 = new Product("productId1", "Product 1", 10);
    await productRepository1.create(product1);

    const orderItem1 = new OrderItem(
      "orderItemId1",
      product1.name,
      product1.price,
      2,
      product1.id
    );

    const productRepository2 = new ProductRepository();
    const product2 = new Product("productId2", "Product 2", 20);
    await productRepository2.create(product2);

    const orderItem2 = new OrderItem(
      "orderItemId2",
      product2.name,
      product2.price,
      2,
      product2.id
    );

    const order1 = new Order("orderId1", customer.id, [orderItem1]);
    const order2 = new Order("orderId2", customer.id, [orderItem2]);

    const orderRepository = new OrderRepository();
    await orderRepository.create(order1);
    await orderRepository.create(order2);

    const ordersFound = await orderRepository.findAll();
    const expectedOrders = [order1, order2];

    expect(ordersFound).toStrictEqual(expectedOrders);
  });
});
