export interface FindAllProductsOutputDto {
  products: {
    id: string;
    name: string;
    description: string;
    price: number;
  }[];
}
