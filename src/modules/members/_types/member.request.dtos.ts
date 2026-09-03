import {
	IsOptional, IsNumber, MaxLength,
	IsEmail,
	IsString,
	IsNotEmpty,
	Matches,
} from "class-validator";
import { ApiProperty } from "@nestjs/swagger";
import { PaginationFilters, PASSWORD_REGEX } from "../../../common";
import { UserAuthStatus } from "../../../database/entities/_enums";

export class CreateMemberRequestDto {
	@IsOptional()
	@MaxLength(100)
	@ApiProperty({ example: "Hassan", name: "first_name" })
	firstName?: string;

	@IsOptional()
	@MaxLength(100)
	@ApiProperty({ example: "Virk", name: "last_name" })
	lastName?: string;

	@IsOptional()
	@MaxLength(100)
	@ApiProperty({ example: "hassan5175", name: "username" })
	username?: string;

	@IsOptional()
	@MaxLength(100)
	@ApiProperty({ example: "+920001234567", name: "phone" })
	phone?: string;

	@MaxLength(100)
	@IsEmail()
	@ApiProperty({ example: "example@example.com", name: "email" })
	email: string;

	@MaxLength(100)
	@IsString()
	@Matches(PASSWORD_REGEX, {
		message: 'Password too weak. It must contain at least one uppercase letter, one lowercase letter, one number, and one special character.',
	})
	@ApiProperty({ example: "Pass@!11", name: "password" })
	password: string;

	@MaxLength(100)
	@IsOptional()
	@ApiProperty({ example: "UTC+05:00", required: false })
	timezone?: string;

	organization?: number;
	role?: number;
}

export class UpdateMemberRequestDto {
	@IsOptional()
	@MaxLength(100)
	@ApiProperty({ example: "Hassan", name: "first_name" })
	firstName?: string;

	@IsOptional()
	@MaxLength(100)
	@ApiProperty({ example: "Virk", name: "last_name" })
	lastName?: string;


	@IsOptional()
	@MaxLength(100)
	@ApiProperty({ example: "+920001234567", name: "phone" })
	phone?: string;

	@MaxLength(100)
	@IsOptional()
	@ApiProperty({ example: "UTC+05:00", required: false })
	timezone?: string;

	@IsNumber()
	@IsOptional()
	@ApiProperty({ example: 1, required: false })
	organization?: number;

}

export interface MemberFilterParams extends PaginationFilters {
	roleId: number;
}

export class SigninCredentialsDto {

	@IsEmail({}, { message: "Email is required" })
	@IsNotEmpty()
	@ApiProperty({ required: true, example: "example@example.com" })
	email?: string;

	@IsString()
	@IsNotEmpty()
	@ApiProperty({ example: "Pass@!11" })
	password: string;
}
export class InviteMemberRequestDto {
	@IsEmail({}, { message: "Email is required" })
	@IsNotEmpty()
	@ApiProperty({ example: "example@example.com" })
	email: string;



	@IsNumber()
	@IsOptional()
	@ApiProperty({ required: true, type: Number })
	role: number;

	roleName: string

	@IsNotEmpty()
	@ApiProperty({ required: true })
	organization: number;
}

export class verifyLinkRequestDto {
	@IsNotEmpty()
	@ApiProperty({ required: true, example: "eyJhbGc.eyJlbWFp.iOHKSKm1" })
	token: string
}

export class PasswordRecoveryDto {
	@IsEmail({}, { message: "Email is required" })
	@IsNotEmpty()
	@ApiProperty({ required: true, example: "Hassanali5062@gmail.com" })
	email: string;
}

export class VeryfyOTPDto extends PasswordRecoveryDto {
	@IsNotEmpty()
	@ApiProperty({ required: true, example: "226600" })
	otp: string;
}

export class recoverPasswordDto extends VeryfyOTPDto {
	@MaxLength(100)
	@IsNotEmpty()
	@IsString()
	@Matches(PASSWORD_REGEX, {
		message: 'Password too weak. It must contain at least one uppercase letter, one lowercase letter, one number, and one special character.',
	})
	@ApiProperty({ example: "Pass@!11", name: "password" })
	password: string;
}
export class RegisterMemberRequestDto extends CreateMemberRequestDto {
	@ApiProperty({ name: "token", description: "invitation token sent to email" })
	@IsString()
	@IsNotEmpty()
	token: string
}

export class changePasswordDto {
	@MaxLength(100)
	@IsNotEmpty()
	@IsString()
	@Matches(PASSWORD_REGEX, {
		message: 'Password too weak. It must contain at least one uppercase letter, one lowercase letter, one number, and one special character.',
	})
	@ApiProperty({ example: "Pass@!11", name: "password" })
	password: string;


	@MaxLength(100)
	@IsNotEmpty()
	@IsString()
	@Matches(PASSWORD_REGEX, {
		message: ' New Password too weak. It must contain at least one uppercase letter, one lowercase letter, one number, and one special character.',
	})
	@ApiProperty({ example: "Pass@!11", name: "new_password" })
	newPassword: string;
}

export class RefreshTokenDto {
	@IsString()
	@IsNotEmpty()
	@ApiProperty({ required: true, name: "token", example: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MywidXNlckRhdGEiOnsiaWQiOjMsImZpcnN0TmFtZSI6ImtoYW4iLC" })
	token: string;
}


export class FindByOrganizationRequestDto {
	@IsNumber()
	organizationId: number;

	@IsOptional()
	status: UserAuthStatus;
}