import { IntersectionType } from '@nestjs/swagger';
import {
	CreateOrderQueryDto,
	PaginationDto,
	SearchQueryDto,
} from '@common/dto';
import { USER_ORDER_FIELDS } from '../user.constants';

export class OrderByUserDto extends CreateOrderQueryDto(USER_ORDER_FIELDS) {}
export class QueryUsersDto extends IntersectionType(
	PaginationDto,
	SearchQueryDto,
	OrderByUserDto,
) {}
