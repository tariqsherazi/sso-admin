import {
	Entity, Column, ManyToMany, JoinTable,
	ManyToOne,
	JoinColumn,
} from "typeorm";
import { PermissionEntity } from "./permission.entity";
import { BaseEntity } from "./abstract.entity";
import { OrganizationEntity } from "./organization.entity";

@Entity({ name: "roles" })
export class RoleEntity extends BaseEntity {
	constructor(data?: Partial<RoleEntity>) {
		super(data);
		Object.assign(this, data);
	}

	@Column({
		name: "name",
		type: "varchar",
		nullable: false,
		length: 50,
	})
	name: string;

	@Column({
		name: "description",
		type: "text",
		nullable: false,
	})
	description: string;

	@ManyToMany(() => PermissionEntity, (permission) => permission.id, {
		lazy: true,
		cascade: true,
	})
	@JoinTable({
		name: "roles_permissions",
		joinColumn: {
			name: "role_id",
			referencedColumnName: "id",
		},
		inverseJoinColumn: {
			name: "permission_id",
			referencedColumnName: "id",
		},
	})
	permissions: Promise<PermissionEntity[]>;

	@ManyToOne(() => OrganizationEntity, { nullable: true, lazy: true }) // Relationship with OrganizationEntity
	@JoinColumn({ name: "organization_id" })
	organization?: OrganizationEntity;
}
