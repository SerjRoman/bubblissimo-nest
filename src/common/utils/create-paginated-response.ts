import { PaginatedResult, PaginationData } from '@common/types';
import { PaginationMetaDto } from '../dto/pagination.dto';

export function createPaginatedResponse<T>(
	data: T[],
	params: Omit<PaginationData, 'totalPages'>,
): PaginatedResult<T> {
	const { page, perPage, total } = params;

	const meta = new PaginationMetaDto({
		page,
		perPage,
		total,
		totalPages: Math.ceil(total / perPage),
	});

	return {
		data,
		meta,
	};
}
