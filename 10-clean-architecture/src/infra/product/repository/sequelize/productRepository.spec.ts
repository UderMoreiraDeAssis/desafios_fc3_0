import { Sequelize } from "sequelize-typescript";
import { Product } from "../../../../domain/product";
import { ProductRepository } from "./ProductRepository";
import { ProductModel } from "../../db";

describe('Product repository test', () => {
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
    const product = new Product("productId", "productName", 100);

    await productRepository.create(product);

    const productModel = await ProductModel.findOne({ where: { id: "productId" } });

    expect(productModel.toJSON()).toStrictEqual({
      id: "productId",
      name: "productName",
      price: 100,
    });
  });

  it('should update a product', async () => {
    const productRepository = new ProductRepository();
    const product = new Product("productId", "productName", 100);

    await productRepository.create(product);

    const productModel = await ProductModel.findOne({ where: { id: "productId" } });

    expect(productModel.toJSON()).toStrictEqual({
      id: "productId",
      name: "productName",
      price: 100,
    });

    product.changeName("newProductName");
    product.changePrice(200);

    await productRepository.update(product);

    const updatedProductModel = await ProductModel.findOne({ where: { id: "productId" } });

    expect(updatedProductModel.toJSON()).toStrictEqual({
      id: "productId",
      name: "newProductName",
      price: 200,
    });
  });

  it('should find a product', async () => {
    const productRepository = new ProductRepository();
    const product = new Product("productId", "productName", 100);

    await productRepository.create(product);

    const productModel = await ProductModel.findOne({ where: { id: "productId" } });

    expect(productModel.toJSON()).toStrictEqual({
      id: "productId",
      name: "productName",
      price: 100,
    });

    const foundProduct = await productRepository.find("productId");

    expect(foundProduct).toStrictEqual(product);
  });

  it('should find all products', async () => {
    const productRepository = new ProductRepository();

    const product1 = new Product("productId1", "productName1", 100);
    await productRepository.create(product1);

    const product2 = new Product("productId2", "productName2", 200);
    await productRepository.create(product2);

    const foundProducts = await productRepository.findAll();
    const expectedProducts = [product1, product2];

    expect(foundProducts).toStrictEqual(expectedProducts);
  });
});
