import { ProductFactory } from "./ProductFactory";

describe('Product factory unit test', () => {
  it('should create a product type a', () => {
    const product = ProductFactory.create('a', 'Product A', 10);

    expect(product.id).toBeDefined();
    expect(product.name).toBe('Product A');
    expect(product.price).toBe(10);
    expect(product.constructor.name).toBe('Product');
  });

  it('should create a product type b', () => {
    const product = ProductFactory.create('b', 'Product B', 10);

    expect(product.id).toBeDefined();
    expect(product.name).toBe('Product B');
    expect(product.price).toBe(20);
    expect(product.constructor.name).toBe('OtherProduct');
  });

  it('should throw an error when product type is invalid', () => {
    expect(() => ProductFactory.create('c', 'Product C', 10)).toThrow('Invalid product type');
  });
});
