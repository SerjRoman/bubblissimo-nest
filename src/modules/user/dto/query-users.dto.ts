import { ApiProperty, IntersectionType } from '@nestjs/swagger';
import { IsObject, IsOptional, IsString } from 'class-validator';
import { PaginationDto } from '@common/dto';
import { TransformAndValidateObject } from '@common/decorators';
import type { FindOptionsOrder } from 'typeorm';
import { User } from '../entities';

export class OrderByUserDto {
	@ApiProperty({
		description: 'Sort users by a specific field and order.',
		example: 'createdAt:desc',
		type: 'string',
		required: false,
	})
	@TransformAndValidateObject({
		allowedFields: ['id', 'username', 'email', 'createdAt'],
		allowedOrders: ['asc', 'desc'],
		delimiter: ':',
		parameterName: 'order',
	})
	@IsObject()
	@IsOptional()
	order?: FindOptionsOrder<User>;
}
export class SearchUserDto {
	@ApiProperty({
		description: 'Search user by a username or email. Insensitive',
		example: 'UserName',
		type: 'string',
		required: false,
	})
	@IsString()
	@IsOptional()
	search?: string;
}

export class QueryUsersDto extends IntersectionType(
	PaginationDto,
	SearchUserDto,
	OrderByUserDto,
) {}
