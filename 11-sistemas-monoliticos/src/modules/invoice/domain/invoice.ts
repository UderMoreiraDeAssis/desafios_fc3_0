import { AggregateRoot } from "../../@shared/domain/entity/aggregate-root.interface";
import { Id } from "../../@shared/domain/value-object/id.value-object";
import { Address } from "./address.value-object";
import { Product } from "./product";

type InvoiceProps = {
  id?: Id;
  name: string;
  document: string;
  address: Address;
  items: Product[];
  createdAt?: Date;
};

export class Invoice implements AggregateRoot {
  private _id: Id;
  private _name: string;
  private _document: string;
  private _address: Address;
  private _items: Product[];
  private _createdAt: Date;

  constructor(props: InvoiceProps) {
    this._id = props.id || new Id();
    this._name = props.name;
    this._document = props.document;
    this._address = props.address;
    this._items = props.items;
    this._createdAt = props.createdAt || new Date();
  }

  get id(): Id {
    return this._id;
  }

  get name(): string {
    return this._name;
  }

  get document(): string {
    return this._document;
  }

  get address(): Address {
    return this._address;
  }

  get items(): Product[] {
    return this._items;
  }

  get createdAt(): Date {
    return this._createdAt;
  }

  get total(): number {
    return this._items.reduce((sum, item) => sum + item.price, 0);
  }
}
