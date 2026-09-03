import { ApiProperty } from "@nestjs/swagger";
import { AbstractDTO } from "../../../database/_types";
import { PermissionResponseDto } from "../../permissions/_types";

class organization {
	@ApiProperty()
	name: string;

	@ApiProperty()
	domain: string;

	@ApiProperty()
	id?: number;
}

export class RoleResponseDto extends AbstractDTO {
	constructor(role?: Partial<RoleResponseDto>) {
		super(role);
		Object.assign(this, role);
	}

	@ApiProperty()
	name: string;

	@ApiProperty()
	description: string;


	@ApiProperty({ type: [PermissionResponseDto] })
	permissions: PermissionResponseDto[];

	@ApiProperty()
	active: boolean;

	@ApiProperty()
	userCount: number;

	@ApiProperty()
	organization: organization;

	id: number;
}

export class RoleDto {
	constructor(role?: Partial<RoleDto>) {
		Object.assign(this, role);
	}

	@ApiProperty()
	id: number;

	@ApiProperty()
	name: string;
}
export class RoleInviteMemberResponseDto {

	@ApiProperty()
	id: number;

	@ApiProperty()
	name: string;
}
