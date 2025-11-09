export interface PaginationParams {
	page: number;
	perPage: number;
}
export type PaginatedResult<T> = [
	T[],
	{ page: number; perPage: number; pageCount: number; total: number },
];
