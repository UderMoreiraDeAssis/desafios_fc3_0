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

const MockRepository = () => {
  return {
    create: jest.fn(),
    update: jest.fn(),
    find: jest.fn(),
    findAll: jest.fn(),
  }
}

describe('Unit test create customer use case', () => {
  it('should create a customer', async () => {
    const customerRepository = MockRepository();
    const usecase = new CreateCustomerUseCase(customerRepository);
    const output = await usecase.execute(input);

    expect(output).toStrictEqual({
      id: expect.any(String),
      ...input,
    });
  });

  it('should throw error when name is empty', async () => {
    const customerRepository = MockRepository();
    const usecase = new CreateCustomerUseCase(customerRepository);

    await expect(usecase.execute({
      ...input,
      name: '',
    })).rejects.toThrow('Name is required');
  });

  it('should throw error when street is empty', async () => {
    const customerRepository = MockRepository();
    const usecase = new CreateCustomerUseCase(customerRepository);

    await expect(usecase.execute({
      ...input,
      address: {
        ...input.address,
        street: '',
      }
    })).rejects.toThrow('Street is required');
  });

  it('should throw error when number is empty', async () => {
    const customerRepository = MockRepository();
    const usecase = new CreateCustomerUseCase(customerRepository);

    await expect(usecase.execute({
      ...input,
      address: {
        ...input.address,
        number: 0,
      }
    })).rejects.toThrow('Number is required');
  });

  it('should throw error when city is empty', async () => {
    const customerRepository = MockRepository();
    const usecase = new CreateCustomerUseCase(customerRepository);

    await expect(usecase.execute({
      ...input,
      address: {
        ...input.address,
        city: '',
      }
    })).rejects.toThrow('City is required');
  });

  it('should throw error when state is empty', async () => {
    const customerRepository = MockRepository();
    const usecase = new CreateCustomerUseCase(customerRepository);

    await expect(usecase.execute({
      ...input,
      address: {
        ...input.address,
        state: '',
      }
    })).rejects.toThrow('State is required');
  });

  it('should throw error when zipCode is empty', async () => {
    const customerRepository = MockRepository();
    const usecase = new CreateCustomerUseCase(customerRepository);

    await expect(usecase.execute({
      ...input,
      address: {
        ...input.address,
        zipCode: '',
      }
    })).rejects.toThrow('ZipCode is required');
  });
});
