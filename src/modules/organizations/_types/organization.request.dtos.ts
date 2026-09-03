import { IsNotEmpty, MaxLength, IsUrl, IsBoolean, IsNumber, IsOptional, IsString } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";
import { Optional } from "@nestjs/common";
import { GeneralStatus } from "../../../database/entities/_enums";

export class CreateOrganizationRequestDto {
    @IsNotEmpty()
    @MaxLength(100)
    @ApiProperty({ example: "Code Crushers", name: "name" })
    name: string;

    @IsNotEmpty()
    @MaxLength(500)
    @IsUrl({}, { message: 'The domain must be a valid URL' })
    @ApiProperty({ example: "https://www.example.com", name: "domain" })
    domain: string;

    status?: GeneralStatus;
    createdBy: number;
    logo?: string;
}

export class UpdateOrganizationRequestDto {

    @IsOptional()
    @MaxLength(100)
    @ApiProperty({ example: "Hassan", name: "name" })
    name: string;

    @IsOptional()
    @MaxLength(100)
    @IsUrl({}, { message: 'The domain must be a valid URL' })
    @ApiProperty({ example: "https://example.com", name: "domain" })
    domain: string;

    @Optional()
    @ApiProperty({ example: "active", name: "status" })
    status: GeneralStatus;

    @IsNumber()
    @IsOptional()
    updatedBy: number;
}

export class ArchiveOrganizationRequestDto {

    @IsNumber()
    @IsOptional()
    deletedBy: any;

    @IsNumber()
    @IsOptional()
    id: number;

    @IsOptional()
    isArchive?: Boolean;

}
export class FilterOrganizationRequestDto {

    @IsNumber()
    createdBy: number;

    @IsString()
    name: string;

}
