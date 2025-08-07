import { Sequelize } from "sequelize-typescript";
import { CustomerModel, CustomerRepository } from "../../../infra/customer";
import { CreateCustomerUseCase } from "./CreateCustomerUseCase";

const input = {
  name: 'John Doe',
  address: {
    street: 'Street 1',
    number: 100,
    city: 'City 1',
    state: 'State 1',
    zipCode: 'ZipCode 1',
  }
};

describe('Integration test create customer use case', () => {
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
    const usecase = new CreateCustomerUseCase(customerRepository);
    const output = await usecase.execute(input);

    expect(output).toStrictEqual({
      id: expect.any(String),
      ...input,
    });
  });
});
