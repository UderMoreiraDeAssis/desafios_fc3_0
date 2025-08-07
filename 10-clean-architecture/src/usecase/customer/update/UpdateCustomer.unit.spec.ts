import { Address } from "../../../domain/customer";
import { CustomerFactory } from "../../../domain/customer/factory";
import { UpdateCustomerUseCase } from "./UpdateCUstomerUseCase";

const customer = CustomerFactory.createWithAddress(
  'John Doe',
  new Address(
    'Street 1',
    100,
    'City 1',
    'State 1',
    'ZipCode 1',
  )
);

const input = {
  id: customer.id,
  name: 'John Doe 2',
  address: {
    street: 'Street 2',
    number: 200,
    city: 'City 2',
    state: 'State 2',
    zipCode: 'ZipCode 2',
  }
}

const MockRepository = () => {
  return {
    create: jest.fn(),
    update: jest.fn(),
    find: jest.fn().mockReturnValue(Promise.resolve(customer)),
    findAll: jest.fn(),
  }
};

describe('Unit test update customer use case', () => {
  it('should update a customer', async () => {
    const customerRepository = MockRepository();
    const usecase = new UpdateCustomerUseCase(customerRepository);
    const output = await usecase.execute(input);

    expect(output).toStrictEqual(input);
  });
});
