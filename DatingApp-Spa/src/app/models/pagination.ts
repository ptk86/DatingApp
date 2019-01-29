export interface Pagination {
  currentPage: number;
  itemsPerPage: number;
  totalItems: number;
  totalPages: number;
}

export class PaginatedResultResult<T> {
  result: T;
  pagination: Pagination;
}
