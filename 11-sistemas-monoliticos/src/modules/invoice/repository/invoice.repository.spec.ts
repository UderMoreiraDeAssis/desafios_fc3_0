import { Sequelize } from "sequelize-typescript";

import { Id } from "../../@shared/domain/value-object/id.value-object";
import { Address } from "../domain/address.value-object";
import { Invoice } from "../domain/invoice";
import { Product } from "../domain/product";

import { InvoiceModel } from "./invoice.model";
import { ItemModel } from "./item.model";
import { InvoiceRepository } from "./invoice.repository";

describe("InvoiceRepository test", () => {
  let sequelize: Sequelize;

  beforeEach(async () => {
    sequelize = new Sequelize({
      dialect: "sqlite",
      storage: ":memory:",
      logging: false,
      sync: { force: true },
    });

    sequelize.addModels([InvoiceModel, ItemModel]);
    await sequelize.sync();
  });

  afterEach(async () => {
    await sequelize.close();
  });

  it("should add an invoice", async () => {
    const address = new Address({
      street: "Main Street",
      number: "123",
      complement: "Next to the bank",
      city: "New York",
      state: "New York",
      zipCode: "122343404",
    });

    const product1 = new Product({
      id: new Id("1"),
      name: "Product 1",
      description: "",
      price: 100,
    });

    const product2 = new Product({
      id: new Id("2"),
      name: "Product 2",
      description: "",
      price: 200,
    });

    const invoice = new Invoice({
      id: new Id("123"),
      name: "Invoice 1",
      document: "Document 1",
      items: [product1, product2],
      address: address,
    });

    const invoiceRepository = new InvoiceRepository();

    const result = await invoiceRepository.add(invoice);

    expect(result.id.id).toEqual(invoice.id.id);
    expect(result.name).toEqual(invoice.name);
    expect(result.document).toEqual(invoice.document);
    expect(result.items[0].name).toEqual(invoice.items[0].name);
    expect(result.items[1].name).toEqual(invoice.items[1].name);
    expect(result.items[1].price).toEqual(invoice.items[1].price);
    expect(result.items[1].id.id).toEqual(invoice.items[1].id.id);
    expect(result.address).toEqual(invoice.address);
    expect(result.total).toEqual(invoice.total);
  });

  it("should find an invoice", async () => {
    await InvoiceModel.create(
      {
        id: "321",
        name: "Invoice 2",
        document: "Document 2",
        createdAt: new Date(),
        updatedAt: new Date(),
        items: [
          {
            id: "1",
            name: "Product 1",
            price: 100,
          },
          {
            id: "2",
            name: "Product 2",
            price: 200,
          },
        ],
        addressStreet: "street",
        addressNumber: "number",
        addressComplement: "complement",
        addressCity: "city",
        addressState: "state",
        addressZipCode: "zipCode",
      },
      {
        include: [ItemModel],
      }
    );

    const invoiceRepository = new InvoiceRepository();

    const result = await invoiceRepository.find("321");

    expect(result.id.id).toEqual("321");
    expect(result.name).toEqual("Invoice 2");
    expect(result.document).toEqual("Document 2");
    expect(result.items[0].name).toEqual("Product 1");
    expect(result.items[1].name).toEqual("Product 2");
    expect(result.items[1].price).toEqual(200);
    expect(result.items[1].id.id).toEqual("2");
    expect(result.total).toEqual(300);
    expect(result.address).toEqual(
      new Address({
        street: "street",
        number: "number",
        complement: "complement",
        city: "city",
        state: "state",
        zipCode: "zipCode",
      })
    );
  });
});
