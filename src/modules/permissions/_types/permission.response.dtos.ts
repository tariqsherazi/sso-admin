import { ApiProperty } from "@nestjs/swagger";
import { AbstractDTO } from "../../../database/_types";

export class PermissionResponseDto extends AbstractDTO {
  constructor(permission?: Partial<PermissionResponseDto>) {
    super(permission);
    Object.assign(this, permission);
  }

  @ApiProperty()
  slug: string;

  @ApiProperty()
  description: string;

  @ApiProperty()
  name: string;

  @ApiProperty()
  active: boolean;

  @ApiProperty({ name: "is_selected" })
  isSelected: boolean;

  @ApiProperty({ name: "is_editable" })
  isEditable: boolean;
}

export class PermissionDto {
  constructor(permission?: Partial<PermissionResponseDto>) {
    Object.assign(this, permission);
  }
  @ApiProperty()
  id: number

  @ApiProperty()
  slug: string;

  @ApiProperty()
  description: string;

  @ApiProperty()
  name?: string
}
