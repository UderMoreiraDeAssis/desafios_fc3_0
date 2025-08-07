import { Id } from "../../@shared/domain/value-object/id.value-object";
import { Product } from "../domain/product.entity";
import { ProductGateway } from "../gateway/product.gateway";
import { ProductModel } from "./product.model";

function productModelToProduct(productModel: ProductModel): Product {
  return new Product({
    id: new Id(productModel.id),
    name: productModel.name,
    description: productModel.description,
    purchasePrice: productModel.purchasePrice,
    stock: productModel.stock,
    createdAt: productModel.createdAt,
    updatedAt: productModel.updatedAt,
  });
}

export class ProductRepository implements ProductGateway {
  async add(product: Product): Promise<void> {
    await ProductModel.create({
      id: product.id.id,
      name: product.name,
      description: product.description,
      purchasePrice: product.purchasePrice,
      price: product.purchasePrice,
      stock: product.stock,
      createdAt: product.createdAt,
      updatedAt: product.updatedAt,
    });
  }

  async find(id: string): Promise<Product> {
    const productOnDB = await ProductModel.findByPk(id);
    if (!productOnDB) {
      throw new Error(`Product with ${id} not found`);
    }
    return productModelToProduct(productOnDB);
  }
}
