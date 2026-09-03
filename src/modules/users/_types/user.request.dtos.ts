import {
	IsArray, IsNotEmpty, IsOptional, IsNumber, MaxLength,
	IsString,
	Matches,
	IsEmail,
} from "class-validator";
import { ApiProperty } from "@nestjs/swagger";
import { PaginationFilters, PASSWORD_REGEX } from "../../../common";
import { Optional } from "@nestjs/common";

export class CreateUserRequestDto {


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

	@IsNumber()
	@IsOptional()
	@ApiProperty({ example: 1, required: false })
	organization?: number;

	@ApiProperty({ example: [1, 2] })
	@IsArray()
	@IsOptional()
	@IsNumber({ allowNaN: false, allowInfinity: false }, { each: true })
	permissions?: number[];

	@ApiProperty({ example: [1, 2] })
	@IsArray()
	@IsOptional()
	@IsNumber({ allowNaN: false, allowInfinity: false }, { each: true })
	roles?: number[];
}

export class UpdateUserRequestDto {

	@ApiProperty({ example: [1, 2] })
	@IsArray()
	@IsNumber({ allowNaN: false, allowInfinity: false }, { each: true })
	@IsOptional()
	permissions: number[];

	@ApiProperty({ example: [1, 2] })
	@IsArray()
	@IsOptional()
	@IsNumber({ allowNaN: false, allowInfinity: false }, { each: true })
	roles: number[];

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

export interface UserFilterParams extends PaginationFilters {
	roleId: number;
}

export class changeUserPasswordDto {
	@MaxLength(100)
	@IsNotEmpty()
	@IsString()
	@Matches(PASSWORD_REGEX, {
		message: 'Password too weak. It must contain at least one uppercase letter, one lowercase letter, one number, and one special character.',
	})
	@ApiProperty({ example: "pass@!11", name: "new_password" })
	newPassword: string;
}


export class verifyOtpDto {

	@IsNotEmpty()
	@IsString()
	@ApiProperty({ example: "13333311", name: "otp" })
	otp: string;

	@Optional()
	userId: number
}

export class verifyUserDto {
	@IsNotEmpty()
	@ApiProperty({ example: "13333311", name: "user_id" })
	userId: number;

}