import { Sequelize } from "sequelize-typescript";
import { ProductModel, ProductRepository } from "../../../infra/product";
import { FindProductUseCase } from "./FindProductUseCase";
import { Product } from "../../../domain/product";

describe('Integration test find product use case', () => {
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

  it('should find a product', async () => {
    const productRepository = new ProductRepository();
    const usecase = new FindProductUseCase(productRepository);

    const product = new Product('123', 'Product Name', 100);

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
