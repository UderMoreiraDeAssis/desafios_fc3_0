import {
  Column,
  Model,
  PrimaryKey,
  Table,
  HasMany,
  CreatedAt,
  UpdatedAt,
} from "sequelize-typescript";
import { ItemModel } from "./item.model";

@Table({ tableName: "invoices", timestamps: true })
export class InvoiceModel extends Model {
  @PrimaryKey
  @Column({ allowNull: false })
  declare id: string;

  @Column({ allowNull: false })
  declare name: string;

  @Column({ allowNull: false })
  declare document: string;

  @CreatedAt
  @Column
  declare createdAt: Date;

  @UpdatedAt
  @Column
  declare updatedAt: Date;

  @HasMany(() => ItemModel, "invoiceId")
  declare items: ItemModel[];

  @Column({ allowNull: false })
  declare addressStreet: string;

  @Column({ allowNull: false })
  declare addressNumber: string;

  @Column({ allowNull: false })
  declare addressComplement: string;

  @Column({ allowNull: false })
  declare addressCity: string;

  @Column({ allowNull: false })
  declare addressState: string;

  @Column({ allowNull: false })
  declare addressZipCode: string;
}
