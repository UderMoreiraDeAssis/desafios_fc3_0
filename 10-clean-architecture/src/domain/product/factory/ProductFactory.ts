import { OtherProduct, Product, ProductTypeInterface } from "../entity";
import { v4 as uuid } from 'uuid';

export class ProductFactory {
  static create(type: string, name: string, price: number): ProductTypeInterface {
    switch (type) {
      case 'a':
        return new Product(uuid(), name, price);
      case 'b':
        return new OtherProduct(uuid(), name, price);
      default:
        throw new Error('Invalid product type');
    }
  }
}
