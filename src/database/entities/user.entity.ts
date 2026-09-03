import { Entity, JoinTable, ManyToMany } from "typeorm";
import { BaseUser } from "./base-user.entity";
import { RoleEntity } from "./role.entity";
import { PermissionEntity } from "./permission.entity";

@Entity({ name: "users" })
export class UserEntity extends BaseUser {
	constructor(data?: Partial<UserEntity>) {
		super(data);
		Object.assign(this, data);
	}

	@ManyToMany(() => RoleEntity, (role) => role.id, { lazy: true, cascade: true })
	@JoinTable({
		name: "users_roles",
		joinColumn: {
			name: "user_id",
			referencedColumnName: "id",
		},
		inverseJoinColumn: {
			name: "role_id",
			referencedColumnName: "id",
		},
	})
	roles: Promise<RoleEntity[]>;

	@ManyToMany(() => PermissionEntity, (permission) => permission.id, { lazy: true, cascade: true })
	@JoinTable({
		name: "users_permissions",
		joinColumn: {
			name: "user_id",
			referencedColumnName: "id",
		},
		inverseJoinColumn: {
			name: "permission_id",
			referencedColumnName: "id",
		},
	})
	permissions: Promise<PermissionEntity[]>;
}
