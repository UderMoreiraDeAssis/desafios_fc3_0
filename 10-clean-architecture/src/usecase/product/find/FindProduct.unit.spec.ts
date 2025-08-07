import { Product } from "../../../domain/product";
import { FindProductUseCase } from "./FindProductUseCase";

const product = new Product('123', 'Product Name', 100);

const MockRepository = () => {
  return {
    create: jest.fn(),
    update: jest.fn(),
    find: jest.fn().mockReturnValue(Promise.resolve(product)),
    findAll: jest.fn(),
  }
};

describe('Unit test find product use case', () => {
  it('should find a product', async () => {
    const productRepository = MockRepository();
    const usecase = new FindProductUseCase(productRepository);

    await productRepository.create(product);

    const input = { id: '123' };
    const output = {
      id: product.id,
      name: product.name,
      price: product.price,
    };

    const result = await usecase.execute(input);

    expect(result).toStrictEqual(output);
  });
});
