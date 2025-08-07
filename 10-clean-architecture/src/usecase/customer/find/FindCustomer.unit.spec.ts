import { Address, Customer } from "../../../domain/customer";
import { FindCustomerUseCase } from "./FindCustomerUseCase";

const customer = new Customer('123', 'John Doe');
const address = new Address("Street 1", 100, "City 1", "State 1", "ZipCode 1");
customer.setAddress(address);

const MockRepository = () => {
  return {
    create: jest.fn(),
    update: jest.fn(),
    find: jest.fn().mockReturnValue(Promise.resolve(customer)),
    findAll: jest.fn(),
  }
};

describe('Unit test find customer use case', () => {
  it('should find a customer', async () => {
    const customerRepository = MockRepository();
    const usecase = new FindCustomerUseCase(customerRepository);

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

  it('should not find a customer', async () => {
    const customerRepository = MockRepository();
    customerRepository.find.mockImplementation(() => {
      throw new Error('Customer not found');
    });
    const usecase = new FindCustomerUseCase(customerRepository);
    const input = { id: '123' };

    expect(() => usecase.execute(input)).rejects.toThrow('Customer not found');
  });
});
