export interface PaginationParams {
	page: number;
	perPage: number;
}
export type PaginationData = {
	page: number;
	perPage: number;
	totalPages: number;
	total: number;
};

export type PaginatedResult<T> = { data: T[]; meta: PaginationData };
