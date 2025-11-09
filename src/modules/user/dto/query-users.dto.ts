import { ApiProperty, IntersectionType } from '@nestjs/swagger';
import { QueryUserDto } from './query-user.dto';
import type { UserSortOptions } from '../user.types';
import { IsObject, IsOptional, IsString } from 'class-validator';
import { PaginationDto } from '@common/dto';
import { TransformAndValidateObject } from '@common/decorators';

export class OrderByUserDto {
	@ApiProperty({
		description: 'Sort users by a specific field and order.',
		example: { createdAt: 'desc' },
		type: 'object',
		properties: {
			id: { type: 'string', enum: ['asc', 'desc'] },
			username: { type: 'string', enum: ['asc', 'desc'] },
			email: { type: 'string', enum: ['asc', 'desc'] },
			createdAt: { type: 'string', enum: ['asc', 'desc'] },
		},
	})
	@TransformAndValidateObject({
		allowedFields: ['id', 'username', 'email', 'createdAt'],
		allowedOrders: ['asc', 'desc'],
		delimiter: ':',
		parameterName: 'orderBy',
	})
	@IsOptional()
	@IsObject()
	orderBy?: UserSortOptions;
}
export class SearchUserDto {
	@ApiProperty({
		description: 'Search user by a username.',
		example: 'user-name',
		type: 'string',
	})
	@IsOptional()
	@IsString()
	search?: string;
}

export class QueryUsersDto extends IntersectionType(
	PaginationDto,
	QueryUserDto,
	SearchUserDto,
	OrderByUserDto,
) {}
