import { Sequelize } from "sequelize-typescript";
import { ProductModel, ProductRepository } from "../../../infra/product";
import { Product, ProductFactory } from "../../../domain/product";
import { UpdateProductUseCase } from "./UpdateProductUseCase";

describe('Integration test update use case', () => {
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

  it('should update a product', async () => {
    const productRepository = new ProductRepository();

    const productFactory = ProductFactory.create(
      'a',
      'Product Name',
      100,
    );

    const product = new Product(
      productFactory.id,
      productFactory.name,
      productFactory.price,
    );

    await productRepository.create(product);

    const input = {
      id: product.id,
      name: 'Product Name 2',
      price: 200,
    };

    const usecase = new UpdateProductUseCase(productRepository);
    const output = await usecase.execute(input);

    expect(output).toStrictEqual(input);
  });
});
