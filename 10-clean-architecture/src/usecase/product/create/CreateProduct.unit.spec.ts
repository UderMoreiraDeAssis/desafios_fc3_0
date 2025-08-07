import { CreateProductUseCase } from "./CreateProductUseCase";

const input = {
  type: 'a',
  name: 'Product Name',
  price: 100,
}

const MockRepository = () => {
  return {
    create: jest.fn(),
    update: jest.fn(),
    find: jest.fn(),
    findAll: jest.fn(),
  }
}

describe('Unit test create product use case', () => {
  it('should create a product', async () => {
    const productRepository = MockRepository();
    const usecase = new CreateProductUseCase(productRepository);
    const output = await usecase.execute(input);

    expect(output).toStrictEqual({
      id: expect.any(String),
      name: input.name,
      price: input.price,
    });
  });

  it('should throw error when name is empty', async () => {
    const productRepository = MockRepository();
    const usecase = new CreateProductUseCase(productRepository);

    await expect(usecase.execute({
      ...input,
      name: '',
    })).rejects.toThrow('Name is required');
  });

  it('should throw error when price is zero', async () => {
    const productRepository = MockRepository();
    const usecase = new CreateProductUseCase(productRepository);

    await expect(usecase.execute({
      ...input,
      price: null,
    })).rejects.toThrow('Price is required');
  });
});
