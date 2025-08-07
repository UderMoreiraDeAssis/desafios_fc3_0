import { Address, CustomerInterface } from "../../../domain/customer";
import { InputUpdateCustomerDto, OutputUpdateCustomerDto } from "./UpdateCustomerDto";

export class UpdateCustomerUseCase {
  private customerRepository: CustomerInterface;

  constructor(customerRepository: CustomerInterface) {
    this.customerRepository = customerRepository;
  }

  async execute(input: InputUpdateCustomerDto): Promise<OutputUpdateCustomerDto> {
    const customer = await this.customerRepository.find(input.id);
    customer.changeName(input.name);
    customer.setAddress(
      new Address(
        input.address.street,
        input.address.number,
        input.address.city,
        input.address.state,
        input.address.zipCode,
      )
    );

    await this.customerRepository.update(customer);

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
