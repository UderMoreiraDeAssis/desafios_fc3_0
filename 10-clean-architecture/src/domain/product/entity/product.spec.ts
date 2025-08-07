import { Product } from "./Product";

describe('Product unit tests', () => {
  it('should throw error when id is empty', () => {
    expect(() => {
      new Product('', 'Product Name', 100);
    }).toThrow('Id is required');
  });

  it('should throw error when name is empty', () => {
    expect(() => {
      new Product('productId', '', 100);
    }).toThrow('Name is required');
  });

  it('should throw error when price is less then zero', () => {
    expect(() => {
      new Product('productId', 'Product Name', null);
    }).toThrow('Price is required');
  });

  it('should throw error when name and price is empty', () => {
    expect(() => {
      new Product('productId', '', null);
    }).toThrow('Name is required, Price is required');
  });

  it('should change name', () => {
    const product = new Product('productId', 'Product Name', 100);
    product.changeName('New Product Name');
    expect(product.name).toEqual('New Product Name');
  });

  it('should change price', () => {
    const product = new Product('productId', 'Product Name', 100);
    product.changePrice(200);
    expect(product.price).toEqual(200);
  });
});
