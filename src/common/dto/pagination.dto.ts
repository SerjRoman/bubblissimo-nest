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
