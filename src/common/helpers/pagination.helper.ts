import { PaginationResponseDto } from "../dtos";
import { PaginationRequest } from "../interfaces";

export class Pagination {
  /**
   * Return pagination response
   * @param PaginationRequest {PaginationRequest}
   * @param totalRecords {number}
   * @param dtos {t[]}
   * @returns {PaginationResponseDto}
   */
  static of<T>({ limit, page, skip }: PaginationRequest<any>, totalRecords: number, dtos: T[]): PaginationResponseDto<T> {
    const totalPages = Math.floor(totalRecords / limit) + (totalRecords % limit > 0 ? 1 : 0);
    const currentPage = +page > 0 ? +page : 1;
    const hasNext = currentPage <= totalPages - 1;

    return {
      payload: dtos,
      paginateOptions: {
        totalPages,
        payloadSize: dtos.length,
        hasNext,
        currentPage,
        skippedRecords: skip,
        totalRecords,
      },
    };
  }
}
