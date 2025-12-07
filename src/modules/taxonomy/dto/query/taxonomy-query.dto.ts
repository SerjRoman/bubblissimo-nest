import {
	CreateOrderQueryDto,
	PaginationDto,
	SearchQueryDto,
} from '@common/dto';
import { IntersectionType } from '@nestjs/swagger';

export class TaxonomyQueryDto extends IntersectionType(
	PaginationDto,
	SearchQueryDto,
	CreateOrderQueryDto(['name']),
) {}
