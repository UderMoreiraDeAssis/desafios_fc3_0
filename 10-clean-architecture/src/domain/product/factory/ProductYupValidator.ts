import { ValidatorInterface } from "../../@shared";
import { OtherProduct, Product } from "../entity";
import { ProductYupValidator } from "../validator";

export class ProductValidatorFactory {
  static create(): ValidatorInterface<Product | OtherProduct> {
    return new ProductYupValidator();
  }
}
