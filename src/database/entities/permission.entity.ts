import { Entity, JoinColumn, ManyToOne, Column } from "typeorm";
import { BaseEntity } from "./abstract.entity";
import { OrganizationEntity } from "./organization.entity";

@Entity({ name: "permissions" })
export class PermissionEntity extends BaseEntity {
	constructor(data?: Partial<PermissionEntity>) {
		super(data);
		Object.assign(this, data);
	}

	@Column({
		name: "name",
		type: "varchar",
		nullable: false,
	})
	name: string;

	@Column({
		name: "slug",
		type: "varchar",
		nullable: false,
		unique: true,
	})
	slug: string;

	@Column({
		name: "description",
		type: "text",
		nullable: false,
	})
	description: string;

	@Column({
		name: "app_id",
		type: "varchar",
		nullable: true,
		length: 160,
	})
	appId?: string | number;


	@ManyToOne(() => OrganizationEntity, (organization) => organization.id, { nullable: true })
	@JoinColumn({ name: "organization_id" })
	public organization?: OrganizationEntity;
}
