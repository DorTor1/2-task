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
export declare const getPaginationParams: ({ page, pageSize }: PaginationParams) => {
    limit: number;
    offset: number;
    page: number;
    pageSize: number;
};
export declare const buildPaginationResult: <T>(items: T[], total: number, page: number, pageSize: number) => PaginationResult<T>;
