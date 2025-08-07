export interface FindStoreCatalogInputDto {
  id: string;
}

export interface FindStoreCatalogOutputDto {
  id: string;
  name: string;
  description: string;
  price: number;
}

export interface FindAllStoreCatalogOutputDto {
  products: {
    id: string;
    name: string;
    description: string;
    price: number;
  }[];
}

export interface StoreCatalogFacadeInterface {
  find(id: FindStoreCatalogInputDto): Promise<FindStoreCatalogOutputDto>;
  findAll(): Promise<FindAllStoreCatalogOutputDto>;
}
