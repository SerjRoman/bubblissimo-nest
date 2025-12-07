import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';

export class TaxonomySummaryDto {
	@ApiProperty()
	@Expose()
	id: string;

	@ApiProperty()
	@Expose()
	slug: string;

	@ApiProperty()
	@Expose()
	name: string;
}
