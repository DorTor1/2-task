export interface PaginationParams {
  page?: number;
  pageSize?: number;
}

export interface PaginationResult<T> {
  items: T[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

export const getPaginationParams = ({ page = 1, pageSize = 20 }: PaginationParams) => {
  const currentPage = Math.max(1, Number(page));
  const limit = Math.min(100, Math.max(1, Number(pageSize)));
  const offset = (currentPage - 1) * limit;
  return { limit, offset, page: currentPage, pageSize: limit };
};

export const buildPaginationResult = <T>(
  items: T[],
  total: number,
  page: number,
  pageSize: number
): PaginationResult<T> => ({
  items,
  total,
  page,
  pageSize,
  totalPages: Math.max(1, Math.ceil(total / pageSize)),
});

