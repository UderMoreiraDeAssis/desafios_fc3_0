import { toXML } from "jstoxml"

import { OutputListCustomerDto } from "../../../usecase/customer/list/ListCustomerDto";

export class CustomerPresenter {
  static toXML(data: OutputListCustomerDto): string {
    const xmlOptions = {
      header: true,
      indent: "  ",
      newLine: "\n",
      allowEmpty: true,
    };

    return toXML({
      customers: {
        customer: data.customers.map((customer) => ({
          id: customer.id,
          name: customer.name,
          address: {
            street: customer.address.street,
            number: customer.address.number,
            city: customer.address.city,
            state: customer.address.state,
            zipCode: customer.address.zipCode,
          }
        })),
      }
    }, xmlOptions);
  }
}
