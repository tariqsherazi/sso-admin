import { ApiProperty } from "@nestjs/swagger";

export class PaginateOptionsDto {
  @ApiProperty({ name: "current_page", example: 1 })
  currentPage: number;

  @ApiProperty({ name: "skipped_records", example: 0 })
  skippedRecords: number;

  @ApiProperty({ name: "total_pages", example: 1 })
  totalPages: number;

  @ApiProperty({ name: "has_next", example: false })
  hasNext: boolean;

  @ApiProperty({ name: "payload_size", example: 1 })
  payloadSize: number;

  @ApiProperty({ name: "total_records", example: 1 })
  totalRecords: number;
}

export class PaginationResponseDto<T> {
  @ApiProperty()
  payload: T[];

  @ApiProperty()
  paginateOptions: PaginateOptionsDto;
}
