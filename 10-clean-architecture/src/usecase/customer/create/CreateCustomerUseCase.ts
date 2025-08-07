import { Address, CustomerInterface } from "../../../domain/customer";
import { CustomerFactory } from "../../../domain/customer/factory";
import { InputCreateCustomerDto, OutputCreateCustomerDto } from "./CreateCustomerDto";

export class CreateCustomerUseCase {
  private customerRepository: CustomerInterface;

  constructor(customerRepository: CustomerInterface) {
    this.customerRepository = customerRepository;
  }

  async execute(input: InputCreateCustomerDto): Promise<OutputCreateCustomerDto> {
    const customer = CustomerFactory.createWithAddress(
      input.name,
      new Address(
        input.address.street,
        input.address.number,
        input.address.city,
        input.address.state,
        input.address.zipCode,
      )
    );

    await this.customerRepository.create(customer);

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
    }
  }
}
