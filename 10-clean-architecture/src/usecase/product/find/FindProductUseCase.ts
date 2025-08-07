import { ProductInterface } from "../../../domain/product";
import { InputFindCustomerDto, OutputFindCustomerDto } from "./FindProductDto";

export class FindProductUseCase {
  private productRepository: ProductInterface;

  constructor(productRepository: ProductInterface) {
    this.productRepository = productRepository;
  }

  async execute(input: InputFindCustomerDto): Promise<OutputFindCustomerDto> {
    const product = await this.productRepository.find(input.id);

    return {
      id: product.id,
      name: product.name,
      price: product.price,
    };
  }
}
