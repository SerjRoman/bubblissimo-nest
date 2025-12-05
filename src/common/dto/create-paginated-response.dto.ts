import { ApiProperty } from '@nestjs/swagger';
import { PaginationMetaDto } from '../dto/pagination.dto';

export function CreatePaginatedResponseDto<T>(type: new () => T) {
	class PaginatedResponseDto {
		@ApiProperty({ type: [type] })
		data: T[];

		@ApiProperty({ type: PaginationMetaDto })
		meta: PaginationMetaDto;
	}

	return PaginatedResponseDto;
}
