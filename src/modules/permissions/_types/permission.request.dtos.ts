import {
  IsBoolean,
  IsNotEmpty, IsNumber, IsOptional, Length, Matches, MaxLength,
} from "class-validator";
import { ApiProperty } from "@nestjs/swagger";

const slugRegex = /^[a-z0-9]+(\\-[a-z0-9]+)*(\.[a-z0-9]+(\\-[a-z0-9]+)*)*$/;
export class CreatePermissionRequestDto {
  @ApiProperty()
  @IsNotEmpty()
  @Matches(slugRegex)
  @MaxLength(60)
  slug: string;

  @ApiProperty()
  @IsNotEmpty()
  @Length(3, 160)
  description: string;

  @ApiProperty()
  @IsNotEmpty()
  name: string;

  @IsNotEmpty()
  appId: any;

  @IsNotEmpty()
  createdBy?: number;

  @IsNumber()
  @IsOptional()
  organization: number;
}

export class UpdatePermissionRequestDto extends CreatePermissionRequestDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsBoolean()
  active: boolean;

  @IsNotEmpty()
  updatedBy: number;
}
export class ArchivePermissionRequestDto {

  @IsNumber()
  @IsOptional()
  deletedBy: any;

  @IsNumber()
  @IsOptional()
  id: number;

  @IsOptional()
  isArchive: Boolean;

}