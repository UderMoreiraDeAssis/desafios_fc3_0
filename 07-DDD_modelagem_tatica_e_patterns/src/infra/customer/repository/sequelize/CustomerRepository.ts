import { Address, Customer, CustomerInterface } from "../../../../domain/customer";
import { CustomerModel } from "../../db";

export class CustomerRepository implements CustomerInterface {
  async create(entity: Customer): Promise<void> {
    await CustomerModel.create({
      id: entity.id,
      name: entity.name,
      street: entity.address.street,
      number: entity.address.number,
      zipCode: entity.address.zipCode,
      city: entity.address.city,
      state: entity.address.state,
      active: entity.isActive(),
      rewardPoints: entity.rewardPoints,
    });
  }
  async update(entity: Customer): Promise<void> {
    await CustomerModel.update({
      name: entity.name,
      street: entity.address.street,
      number: entity.address.number,
      zipCode: entity.address.zipCode,
      city: entity.address.city,
      state: entity.address.state,
      active: entity.isActive(),
      rewardPoints: entity.rewardPoints,
    },
    {
      where: { id: entity.id },
    });
  }
  async find(id: string): Promise<Customer> {
    let customerModel;

    try {
      customerModel = await CustomerModel.findOne({
        where: { id },
        rejectOnEmpty: true,
      });
    } catch (error) {
      throw new Error('Customer not found');
    }

    const customer = new Customer(id, customerModel.name);
    const address = new Address(
      customerModel.street,
      customerModel.number,
      customerModel.city,
      customerModel.state,
      customerModel.zipCode,
    );
    customer.setAddress(address);
    return customer;
  }
  async findAll(): Promise<Customer[]> {
    const customerModels = await CustomerModel.findAll();

    const customers = customerModels.map((customerModel) => {
      let customer = new Customer(customerModel.id, customerModel.name);
      const address = new Address(
        customerModel.street,
        customerModel.number,
        customerModel.city,
        customerModel.state,
        customerModel.zipCode,
      );
      customer.setAddress(address);
      if (customerModel.active) {
        customer.activate();
      }
      customer.addRewardPoints(customerModel.rewardPoints);
      return customer;
    });
    return customers;
  }

}
