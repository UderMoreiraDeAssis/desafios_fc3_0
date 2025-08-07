import {
  Table,
  Model,
  PrimaryKey,
  Column,
  ForeignKey,
  BelongsTo,
} from "sequelize-typescript";

@Table({ tableName: "items", timestamps: false })
export class ItemModel extends Model {
  @PrimaryKey
  @Column
  declare id: string;

  @ForeignKey(() => require("./invoice.model").InvoiceModel)
  @Column
  declare invoiceId: string;

  @BelongsTo(() => require("./invoice.model").InvoiceModel)
  declare invoice: any;

  @Column
  declare name: string;

  @Column
  declare price: number;
}
