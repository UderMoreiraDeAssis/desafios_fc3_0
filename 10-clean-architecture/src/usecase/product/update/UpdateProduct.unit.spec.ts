import { ProductFactory } from "../../../domain/product";
import { UpdateProductUseCase } from "./UpdateProductUseCase";

const product = ProductFactory.create(
  'a',
  'Product Name',
  100,
);

const input = {
  id: product.id,
  name: 'Product Name 2',
  price: 200,
};

const MockRepository = () => {
  return {
    create: jest.fn(),
    update: jest.fn(),
    find: jest.fn().mockReturnValue(Promise.resolve(product)),
    findAll: jest.fn(),
  }
};

describe('Unit test update product use case', () => {
  it('should update a product', async () => {
    const productRepository = MockRepository();
    const usecase = new UpdateProductUseCase(productRepository);
    const output = await usecase.execute(input);

    expect(output).toStrictEqual(input);
  });
});
