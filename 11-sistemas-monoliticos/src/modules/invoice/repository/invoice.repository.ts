import { Address } from "../domain/address.value-object";
import { InvoiceModel } from "./invoice.model";
import { InvoiceGateway } from "../gateway/invoice.gateway";
import { Id } from "../../@shared/domain/value-object/id.value-object";
import { ItemModel } from "./item.model";
import { Invoice } from "../domain/invoice";
import { Product } from "../domain/product";

export class InvoiceRepository implements InvoiceGateway {
  async find(id: string): Promise<Invoice> {
    const invoiceModel = await InvoiceModel.findOne({
      where: { id },
      include: ["items"],
    });

    if (!invoiceModel) throw new Error("Invoice not found");

    const invoice = new Invoice({
      id: new Id(invoiceModel.id),
      name: invoiceModel.name,
      document: invoiceModel.document,
      address: new Address({
        street: invoiceModel.addressStreet,
        number: invoiceModel.addressNumber,
        complement: invoiceModel.addressComplement,
        city: invoiceModel.addressCity,
        state: invoiceModel.addressState,
        zipCode: invoiceModel.addressZipCode,
      }),
      items: invoiceModel.items.map(
        (item) =>
          new Product({
            id: new Id(item.id),
            name: item.name,
            price: item.price,
          })
      ),
      createdAt: invoiceModel.createdAt,
    });

    return invoice;
  }

  async generate(invoice: Invoice): Promise<void> {
    const { id, name, document, createdAt, items, address } = invoice;

    await InvoiceModel.create(
      {
        id: id.id,
        name,
        document,
        createdAt,
        updatedAt: new Date(),
        addressStreet: address.street,
        addressNumber: address.number,
        addressComplement: address.complement,
        addressCity: address.city,
        addressState: address.state,
        addressZipCode: address.zipCode,
        items: items.map((item) => ({
          id: item.id.id,
          name: item.name,
          price: item.price,
        })),
      },
      {
        include: [ItemModel],
      }
    );
  }

  async add(invoice: Invoice): Promise<Invoice> {
    await this.generate(invoice);
    return invoice;
  }
}
