export interface PaginationResult<T> {
  data: T[];
  total: number;
}

export function applyPagination<T>(
  items: T[],
  total: number,
): PaginationResult<T> {
  return { data: items, total };
}
