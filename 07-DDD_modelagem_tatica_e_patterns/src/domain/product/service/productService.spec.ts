import { Product } from "../entity";
import { ProductService } from "./ProductService";

describe('Product service unit tests', () => {
  it('should change the prices of all products', () => {
    const product1 = new Product("product1", "Product 1", 10);
    const product2 = new Product("product2", "Product 2", 20);
    const products = [product1, product2];

    ProductService.increasePrices(products, 100);

    expect(product1.price).toEqual(20);
    expect(product2.price).toEqual(40);
  });
});
