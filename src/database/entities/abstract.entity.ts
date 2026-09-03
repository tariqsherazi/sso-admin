import {
  Column,
  CreateDateColumn, DeleteDateColumn, PrimaryGeneratedColumn, UpdateDateColumn, ManyToOne, JoinColumn,
} from "typeorm";
import { UserDataDTO } from "../_types";

export abstract class BaseEntity {
  constructor(data?: Partial<BaseEntity>) {
    Object.assign(this, data);
  }

  @PrimaryGeneratedColumn({ name: "id", type: "integer" })
  id?: number;

  @CreateDateColumn({
    type: "timestamp without time zone",
    name: "created_at",
  })
  createdAt?: Date;

  @UpdateDateColumn({
    type: "timestamp without time zone",
    name: "updated_at",
  })
  updatedAt?: Date;

  @DeleteDateColumn({
    type: "timestamp without time zone",
    name: "deleted_at",
  })
  deletedAt?: Date;

  @Column({
    type: "boolean",
    name: "is_archive",
    nullable: false,
    default: false,
  })
  isArchive?: boolean;

  @Column({
    type: "int",
    name: "created_by",
    nullable: true,
  })
  public createdBy?: UserDataDTO;

  @Column({
    type: "int",
    name: "updated_by",
    nullable: true,
  })
  public updatedBy?: UserDataDTO;

  @Column({
    type: "int",
    name: "deleted_by",
    nullable: true,
  })
  public deletedBy?: UserDataDTO;

}
