import { Address } from "../valueObject";
import { CustomerFactory } from "./CustomerFactory";

describe('Customer factory unit test', () => {
  it('should create a customer', () => {
    const customer = CustomerFactory.create("John Doe");

    expect(customer.id).toBeDefined();
    expect(customer.name).toBe("John Doe");
    expect(customer.address).toBeUndefined();
  });

  it('should create a customer with address', () => {
    const address = new Address("Street 1", 100, "City 1", "State 1", "ZipCode 1");

    const customer = CustomerFactory.createWithAddress("John Doe", address);

    expect(customer.id).toBeDefined();
    expect(customer.name).toBe("John Doe");
    expect(customer.address).toBe(address);
  });
});
