import { IsNotEmpty, MaxLength, IsUrl, IsNumber, IsOptional, IsArray, ArrayNotEmpty, IsString, isBoolean } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";
import { Optional } from "@nestjs/common";
import { GeneralStatus } from "../../../database/entities/_enums";

export class CreateApplicationRequestDto {
    @IsNotEmpty()
    @MaxLength(100)
    @ApiProperty({ example: "App", name: "app_name" })
    appName: string;

    @IsUrl({}, { message: 'The url must be a valid URL' })
    @IsOptional()
    @ApiProperty({ example: "https://ai.com", name: "url" })
    url: string;

    @Optional()
    status: GeneralStatus;

    @IsNumber()
    @IsNotEmpty()
    @ApiProperty({ name: "organization" })
    organization: number;


    @IsNumber()
    @IsOptional()
    createdBy: number;

    @IsArray()
    @IsString({ each: true })
    @ApiProperty({ name: "redirect_uri", example: ["https://example.com"] })
    redirectUri: string[];
}

export class UpdateApplicationRequestDto {
    @IsNotEmpty()
    @MaxLength(100)
    @ApiProperty({ example: "App", name: "app_name" })
    appName: string;

    @IsUrl({}, { message: 'The url must be a valid URL' })
    @IsOptional()
    @ApiProperty({ example: "https://example.com", name: "url" })
    url: string;

    @Optional()
    @ApiProperty({ example: "active", name: "status" })
    status: GeneralStatus;

    @ApiProperty({ name: "organization" })
    organization: number;

    @IsArray()
    @IsString({ each: true })
    @ApiProperty({ name: "redirect_uri", example: ['https://example.com'] })
    redirectUri: string[];


    @IsNumber()
    @IsOptional()
    updatedBy: number;


}

export class ArchiveApplicationRequestDto {

    @IsNumber()
    @IsOptional()
    deletedBy: any;

    @IsNumber()
    @IsOptional()
    id: number;

    @IsOptional()
    isArchive?: Boolean;

}

export class appSecretUpdateRequestDto {

    @IsNumber()
    @IsOptional()
    updatedBy?: any;

    @IsNumber()
    @IsOptional()
    id?: number;

    @IsString()
    @IsOptional()
    appSecret?: string;
}

export class FilterApplicationRequestDto {

    @IsNumber()
    organization: number;

    @IsString()
    appName: string;

}


export class FilterByOrganizationRequestDto {
    @IsNumber()
    organizationId: number;

    @IsOptional()
    status: GeneralStatus;
}