export interface InputCreateCustomerDto {
  name: string;
  address: {
    street: string;
    number: number;
    city: string;
    state: string;
    zipCode: string;
  }
}

export interface OutputCreateCustomerDto {
  id: string;
  name: string;
  address: {
    street: string;
    number: number;
    city: string;
    state: string;
    zipCode: string;
  }
}
