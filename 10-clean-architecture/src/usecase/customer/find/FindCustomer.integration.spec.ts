import { Sequelize } from "sequelize-typescript";
import { CustomerModel, CustomerRepository } from "../../../infra/customer";
import { Address, Customer } from "../../../domain/customer";
import { FindCustomerUseCase } from "./FindCustomerUseCase";

describe('Integration test find customer use case', () => {
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

  it('should find a customer', async () => {
    const customerRepository = new CustomerRepository();
    const usecase = new FindCustomerUseCase(customerRepository);

    const customer = new Customer('123', 'John Doe');
    const address = new Address("Street 1", 100, "City 1", "State 1", "ZipCode 1");
    customer.setAddress(address);

    await customerRepository.create(customer);

    const input = { id: '123' };
    const output = {
      id: customer.id,
      name: customer.name,
      address: {
        street: customer.address.street,
        number: customer.address.number,
        city: customer.address.city,
        state: customer.address.state,
        zipCode: customer.address.zipCode,
      }
    };
    const result = await usecase.execute(input);

    expect(result).toStrictEqual(output);
  });
});
