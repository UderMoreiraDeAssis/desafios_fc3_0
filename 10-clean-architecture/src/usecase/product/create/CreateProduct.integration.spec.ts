import { Sequelize } from "sequelize-typescript";
import { ProductModel, ProductRepository } from "../../../infra/product";
import { CreateProductUseCase } from "./CreateProductUseCase";

const input = {
  type: 'a',
  name: 'Product Name',
  price: 100
};

describe('Integration test create product use case', () => {
  let sequelize: Sequelize;

  beforeEach(async () => {
    sequelize = new Sequelize({
      dialect: 'sqlite',
      storage: ':memory:',
      logging: false,
      sync: { force: true },
    });

    sequelize.addModels([ProductModel]);
    await sequelize.sync();
  });

  afterEach(async () => {
    await sequelize.close();
  });

  it('should create a product', async () => {
    const productRepository = new ProductRepository();
    const usecase = new CreateProductUseCase(productRepository);
    const output = await usecase.execute(input);

    expect(output).toStrictEqual({
      id: expect.any(String),
      name: input.name,
      price: input.price,
    });
  });

  it('should throw error when name is empty', async () => {
    const productRepository = new ProductRepository();
    const usecase = new CreateProductUseCase(productRepository);

    await expect(usecase.execute({
      ...input,
      name: '',
    })).rejects.toThrow('Name is required');
  });

  it('should throw error when price is zero', async () => {
    const productRepository = new ProductRepository();
    const usecase = new CreateProductUseCase(productRepository);

    await expect(usecase.execute({
      ...input,
      price: null,
    })).rejects.toThrow('Price is required');
  });
});
