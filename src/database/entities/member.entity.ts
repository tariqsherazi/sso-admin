import { Entity, JoinColumn, JoinTable, ManyToMany, ManyToOne } from "typeorm";
import { BaseUser } from "./base-user.entity";
import { RoleEntity } from "./role.entity";
import { PermissionEntity } from "./permission.entity";

@Entity({ name: "members" })
export class MemberEntity extends BaseUser {
	constructor(data?: Partial<MemberEntity>) {
		super(data);
		Object.assign(this, data);
	}

	@ManyToOne(() => RoleEntity, role => role.id)
	@JoinColumn({ name: 'role_id' })
	role: RoleEntity;
}
