import { CustomerInterface } from "../../../domain/customer";
import { InputFindCustomerDto, OutputFindCustomerDto } from "./FindCustomerDto";

export class FindCustomerUseCase {
  private customerRepository: CustomerInterface;

  constructor(customerRepository: CustomerInterface) {
    this.customerRepository = customerRepository;
  }

  async execute(input: InputFindCustomerDto): Promise<OutputFindCustomerDto> {
    const customer = await this.customerRepository.find(input.id);

    return {
      id: customer.id,
      name: customer.name,
      address: {
        street: customer.address.street,
        number: customer.address.number,
        city: customer.address.city,
        state: customer.address.state,
        zipCode: customer.address.zipCode,
      }
    };
  }
}
