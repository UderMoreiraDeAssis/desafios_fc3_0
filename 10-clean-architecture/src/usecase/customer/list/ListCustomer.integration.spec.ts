import { Sequelize } from "sequelize-typescript";
import { CustomerModel, CustomerRepository } from "../../../infra/customer";
import { CreateCustomerUseCase } from "../create";
import { ListCustomerUseCase } from "./ListCustomerUseCase";

const inputCustomer1 = {
  name: 'John Doe',
  address: {
    street: 'Street 1',
    number: 100,
    city: 'City 1',
    state: 'State 1',
    zipCode: 'ZipCode 1',
  }
};

const inputCustomer2 = {
  name: 'Jane Doe',
  address: {
    street: 'Street 2',
    number: 200,
    city: 'City 2',
    state: 'State 2',
    zipCode: 'ZipCode 2',
  }
}

describe('Integration test list customer use case', () => {
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

  it('should list customers', async () => {
    const costumerRepository = new CustomerRepository();

    const createUseCase = new CreateCustomerUseCase(costumerRepository);
    createUseCase.execute(inputCustomer1);
    createUseCase.execute(inputCustomer2);

    const usecase = new ListCustomerUseCase(costumerRepository);
    const output = await usecase.execute({});

    expect(output.customers[0].name).toBe(inputCustomer1.name);
    expect(output.customers[0].address.street).toBe(inputCustomer1.address.street);

    expect(output.customers[1].name).toBe(inputCustomer2.name);
    expect(output.customers[1].address.street).toBe(inputCustomer2.address.street);
  });
});
