import { Sequelize } from "sequelize-typescript";
import { ProductModel, ProductRepository } from "../../../infra/product";
import { CreateProductUseCase } from "../create/CreateProductUseCase";
import { ListProductUseCase } from "./ListProductUseCase";

const inputProduct1 = {
  type: 'a',
  name: 'Product 1',
  price: 100
};

const inputProduct2 = {
  type: 'a',
  name: 'Product 2',
  price: 200
};

describe('Integration test list product use case', () => {
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

  it('should list products', async () => {
    const productRepository = new ProductRepository();

    const createUseCase = new CreateProductUseCase(productRepository);
    createUseCase.execute(inputProduct1);
    createUseCase.execute(inputProduct2);

    const usecase = new ListProductUseCase(productRepository);
    const output = await usecase.execute({});

    expect(output.products[0].name).toBe(inputProduct1.name);
    expect(output.products[0].price).toBe(inputProduct1.price);

    expect(output.products[1].name).toBe(inputProduct2.name);
    expect(output.products[1].price).toBe(inputProduct2.price);
  });
});
