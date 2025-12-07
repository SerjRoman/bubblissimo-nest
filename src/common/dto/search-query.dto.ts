import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsOptional } from 'class-validator';

export class SearchQueryDto {
	@ApiProperty({
		description: 'Search entities. Insensitive',
		type: 'string',
		required: false,
	})
	@IsString()
	@IsOptional()
	search?: string;
}
