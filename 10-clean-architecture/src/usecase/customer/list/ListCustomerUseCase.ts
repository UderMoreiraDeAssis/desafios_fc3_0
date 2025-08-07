import { Customer, CustomerInterface } from "../../../domain/customer";
import { InputListCustomerDto, OutputListCustomerDto } from "./ListCustomerDto";

export class ListCustomerUseCase {
  private customerRepository: CustomerInterface;

  constructor(customerRepository: CustomerInterface) {
    this.customerRepository = customerRepository;
  }

  async execute(input: InputListCustomerDto): Promise<OutputListCustomerDto> {
    const customers = await this.customerRepository.findAll();
    return OutputMapper.toOutput(customers);
  }
}

class OutputMapper {
  static toOutput(customer: Customer[]): OutputListCustomerDto {
    return {
      customers: customer.map(customer => {
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
      })
    }
  }
}
