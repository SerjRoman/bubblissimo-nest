import { TransformAndValidateObject } from '@common/decorators';
import { ApiProperty } from '@nestjs/swagger';
import { IsObject, IsOptional } from 'class-validator';

export function CreateOrderQueryDto<T extends string>(allowedFields: T[]) {
	class OrderByMixin {
		@ApiProperty({
			description: `Sort by specific fields. Allowed fields: ${allowedFields.join(', ')}`,
			type: 'string',
			required: false,
		})
		@TransformAndValidateObject({
			allowedFields: allowedFields,
			allowedOrders: ['asc', 'desc'],
			delimiter: ':',
			parameterName: 'order',
		})
		@IsObject()
		@IsOptional()
		order?: Record<T, 'asc' | 'desc'>;
	}

	return OrderByMixin;
}
