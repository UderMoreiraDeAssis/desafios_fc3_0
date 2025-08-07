import { Sequelize } from "sequelize-typescript";
import { CustomerRepository } from "./CustomerRepository";
import { CustomerModel } from "../../db";
import { Address, Customer } from "../../../../domain/customer";

describe('Customer repository test', () => {
  let sequelize: Sequelize;

  beforeEach(async () => {
    sequelize = new Sequelize({
      dialect: 'sqlite',
      storage: ':memory:',
      logging: false,
      sync: { force: true },
    });

    sequelize.addModels([CustomerModel]);
    await sequelize.sync();
  });

  afterEach(async () => {
    await sequelize.close();
  });

  it('should create a customer', async () => {
    const customerRepository = new CustomerRepository();
    const customer = new Customer("customerId", "customerName");
    const address = new Address("street", 1, "city", "state", "zipCode");
    customer.setAddress(address);
    await customerRepository.create(customer);

    const customerModel = await CustomerModel.findOne({ where: { id: "customerId" } });

    expect(customerModel.toJSON()).toStrictEqual({
      id: "customerId",
      name: customer.name,
      street: address.street,
      number: address.number,
      zipCode: address.zipCode,
      city: address.city,
      state: address.state,
      active: customer.isActive(),
      rewardPoints: customer.rewardPoints,
    });
  });

  it('should update a customer', async () => {
    const customerRepository = new CustomerRepository();
    const customer = new Customer("customerId", "customerName");
    const address = new Address("street", 1, "city", "state", "zipCode");
    customer.setAddress(address);

    await customerRepository.create(customer);

    customer.changeName("newCustomerName");
    await customerRepository.update(customer);
    const customerModel = await CustomerModel.findOne({ where: { id: "customerId" } });

    expect(customerModel.toJSON()).toStrictEqual({
      id: "customerId",
      name: customer.name,
      active: customer.isActive(),
      rewardPoints: customer.rewardPoints,
      street: address.street,
      number: address.number,
      zipCode: address.zipCode,
      city: address.city,
      state: address.state,
    });
  });

  it('should find a customer', async () => {
    const customerRepository = new CustomerRepository();
    const customer = new Customer("customerId", "customerName");
    const address = new Address("street", 1, "city", "state", "zipCode");
    customer.setAddress(address);

    await customerRepository.create(customer);

    const customerResult = await customerRepository.find(customer.id);

    expect(customer).toStrictEqual(customerResult);
  });

  it('should throw an error when customer is not found', async () => {
    const customerRepository = new CustomerRepository();

    expect(async () => {
      await customerRepository.find("customerId");
    }).rejects.toThrow("Customer not found");
  });

  it('should find all products', async () => {
    const customerRepository = new CustomerRepository();

    const customer1 = new Customer("customerId1", "customerName1");
    const address1 = new Address("street1", 1, "city1", "state1", "zipCode1");
    customer1.setAddress(address1);
    customer1.addRewardPoints(10);
    customer1.activate();

    const customer2 = new Customer("customerId2", "customerName2");
    const address2 = new Address("street2", 2, "city2", "state2", "zipCode2");
    customer2.setAddress(address2);
    customer2.addRewardPoints(20);
    customer2.activate();

    await customerRepository.create(customer1);
    await customerRepository.create(customer2);

    const customers = await customerRepository.findAll();

    expect(customers).toHaveLength(2);
    expect(customers).toContainEqual(customer1);
    expect(customers).toContainEqual(customer2);
  });
});
