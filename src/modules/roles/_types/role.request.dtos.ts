import {
	ArrayNotEmpty, IsArray, IsBoolean, IsNotEmpty, IsNumber, IsOptional, IsString, MaxLength,
} from "class-validator";
import { ApiProperty } from "@nestjs/swagger";

export class CreateRoleRequestDto {
	@ApiProperty()
	@IsNotEmpty()
	@MaxLength(50)
	name: string;

	@ApiProperty({ example: [1, 2] })
	// @ArrayNotEmpty()
	@IsArray()
	@IsNumber({ allowNaN: false, allowInfinity: false }, { each: true })
	permissions: number[];

	@IsNotEmpty()
	@IsNumber()
	@ApiProperty({ example: 1, required: true })
	organization: number;

	@ApiProperty()
	@IsNotEmpty()
	@MaxLength(200)
	description: string;

	createdBy?: number
}

export class UpdateRoleRequestDto extends CreateRoleRequestDto {
	@ApiProperty()
	@IsOptional()
	@IsBoolean()
	active?: boolean;

	updatedBy?: number

}


export class FilterRoleRequestDto {

	@IsNumber()
	organization: number;

	@IsString()
	name: string;

}


export class ArchiveRoleRequestDto {
    @IsNumber()
    @IsOptional()
    deletedBy: any;

    @IsNumber()
    @IsOptional()
    id: number;

    @IsOptional()
    isArchive?: Boolean;
}