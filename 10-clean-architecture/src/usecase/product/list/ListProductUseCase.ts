import { Product, ProductInterface } from "../../../domain/product";
import { InputListProductDto, OutputListProductDto } from "./ListProductDto";

export class ListProductUseCase {
  private productRepository: ProductInterface;

  constructor(productRepository: ProductInterface) {
    this.productRepository = productRepository;
  }

  async execute(input: InputListProductDto): Promise<OutputListProductDto> {
    const products = await this.productRepository.findAll();
    return OutputMapper.toOutput(products);
  }
}

class OutputMapper {
  static toOutput(product: Product[]): OutputListProductDto {
    return {
      products: product.map(product => {
        return {
          id: product.id,
          name: product.name,
          price: product.price,
        }
      })
    }
  }
}
