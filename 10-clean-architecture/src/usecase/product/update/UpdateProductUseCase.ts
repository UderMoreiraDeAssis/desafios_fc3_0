import { ProductInterface } from "../../../domain/product";
import { InputProductDto, OutputProductDto } from "./UpdateProductDto";

export class UpdateProductUseCase {
  private productRepository: ProductInterface;

  constructor(productRepository: ProductInterface) {
    this.productRepository = productRepository;
  }

  async execute(input: InputProductDto): Promise<OutputProductDto> {
    const product = await this.productRepository.find(input.id);
    product.changeName(input.name);
    product.changePrice(input.price);

    await this.productRepository.update(product);

    return {
      id: product.id,
      name: product.name,
      price: product.price,
    };
  }
}
