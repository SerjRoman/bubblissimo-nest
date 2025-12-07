import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsInt, IsOptional, Max, Min } from 'class-validator';

export class PaginationDto {
	@ApiProperty({
		description: 'The page number to retrieve.',
		example: 1,
		default: 1,
		required: false,
	})
	@IsOptional()
	@Type(() => Number)
	@IsInt()
	@Min(1)
	page: number = 1;

	@ApiProperty({
		description: 'The number of items to retrieve per page.',
		example: 10,
		default: 10,
		required: false,
	})
	@IsOptional()
	@Type(() => Number)
	@IsInt()
	@Min(1)
	@Max(100)
	perPage: number = 10;
}

export class PaginationMetaDto {
	@ApiProperty()
	readonly page: number;

	@ApiProperty()
	readonly perPage: number;

	@ApiProperty()
	readonly total: number;

	@ApiProperty()
	readonly totalPages: number;

	constructor({ page, perPage, totalPages, total }) {
		this.page = page;
		this.perPage = perPage;
		this.totalPages = totalPages;
		this.total = total;
	}
}
