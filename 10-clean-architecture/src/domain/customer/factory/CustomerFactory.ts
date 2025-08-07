import { Customer } from "../entity";
import { v4 as uuid } from "uuid";
import { Address } from "../valueObject";

export class CustomerFactory {
  public static create(name: string): Customer {
    return new Customer(uuid(), name);
  }

  public static createWithAddress(name: string, address: Address): Customer {
    const customer = new Customer(uuid(), name);
    customer.setAddress(address);
    return customer;
  }
}
