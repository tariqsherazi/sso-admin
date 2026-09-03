import { ApiProperty } from "@nestjs/swagger";
import { AbstractDTO } from "../../../database/_types";
import { PermissionDto } from "../../permissions/_types";
import { RoleDto } from "../../roles/_types";
import { IsNumber, IsOptional } from "class-validator";

class Organization {
	@ApiProperty()
	name: string;
	@ApiProperty()
	id: number;
	@ApiProperty()
	domain: string
	@ApiProperty()
	logo: string
}

export class MemberResponseDto extends AbstractDTO {
	@ApiProperty()
	id: number;

	@ApiProperty({ name: "first_name" })
	firstName: string;

	@ApiProperty({ name: "last_name" })
	lastName: string;

	@ApiProperty({ name: "phone" })
	phone: string;

	@ApiProperty({ name: "email" })
	email: string;

	@ApiProperty({ name: "username" })
	username: string;

	@ApiProperty({ name: "status" })
	status: string;

	@ApiProperty({ name: "email_verified" })
	emailVerified: boolean;

	@ApiProperty({ example: "UTC+05:00" })
	timezone: string;

	@ApiProperty({ type: Organization })
	organization: Organization;

	@ApiProperty({ type: RoleDto })
	role?: RoleDto;

	@ApiProperty({ type: [PermissionDto] })
	permissions?: PermissionDto[];

	@ApiProperty({ example: "https://example.com" })
	profilePicture?: string;

	@ApiProperty({ example: new Date().toISOString() })
	lastLoggedIn?: string;
}
export class VerifyLinkResponseDto {

	@ApiProperty()
	email: string;

	@ApiProperty()
	orginazition: number;

	@ApiProperty()
	roles: string[]


}

export class ArchiveMemberRequestDto {

	@IsNumber()
	@IsOptional()
	deletedBy: any;

	@IsNumber()
	@IsOptional()
	id: number;

	@IsOptional()
	isArchive?: Boolean;

}