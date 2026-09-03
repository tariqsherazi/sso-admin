import { ApiProperty } from "@nestjs/swagger";
import { MemberResponseDto } from "../../../modules/members/_types";

export interface ValidateTokenResponseDto {
	valid: boolean;
}

export interface RoleJwtDto {
	id: number;
	name: string;
}
export class PermissionDto {
	slug: string;
	id: number;
}

export class RoleDto {
	id: number;
	name: string;
}

export class OrganizationDto {
	id: number;
	name: string;
}

export class UserDataDto {
	permissions: PermissionDto[];
	role: RoleDto;
	organization: OrganizationDto;
}


export interface JwtPayload {
	id: number;
	username: string;
	email: string;
	userData?: UserDataDto;
}

export interface InviteMemberPayload {
	email: string;
	username: string;
	organization: number;
	role: RoleJwtDto;
}



export class TokenDto {
	@ApiProperty({ name: "access_token" })
	accessToken: string;

	@ApiProperty({ name: "access_token_expires" })
	accessTokenExpires: string;

	@ApiProperty({ name: "refresh_token" })
	refreshToken: string;
}
export class AuthTokenResponseDto extends TokenDto {
	@ApiProperty({ type: [MemberResponseDto] })
	user: MemberResponseDto;
}




