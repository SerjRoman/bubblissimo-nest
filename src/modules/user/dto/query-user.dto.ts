import { ApiProperty } from '@nestjs/swagger';
import { IsObject, IsOptional } from 'class-validator';
import type { UserSelect, UserInclude } from '../user.types';
import {
	USER_INCLUDE_FIELDS,
	USER_SELECT_FIELDS,
} from '../constants/user.constants';
import {
	IsOnlyOnePresent,
	TransformAndValidateArray,
} from '@common/decorators';

export class QueryUserDto {
	@ApiProperty({
		description: `Comma-separated list of relations to include. Allowed values: ${USER_INCLUDE_FIELDS.join(', ')}`,
		example: 'teacherProfile,favouriteQuizzes',
		required: false,
		type: String,
	})
	@IsOptional()
	@TransformAndValidateArray({
		allowedValues: USER_INCLUDE_FIELDS,
		parameterName: 'include',
	})
	@IsObject()
	@IsOnlyOnePresent({ optionalFields: ['include', 'select'] })
	include?: UserInclude;

	@ApiProperty({
		description: `Comma-separated list of fields to select. Allowed values: ${USER_SELECT_FIELDS.join(', ')}`,
		example: 'id,name,teacherProfile',
		required: false,
		type: String,
	})
	@IsOptional()
	@TransformAndValidateArray({
		allowedValues: USER_SELECT_FIELDS,
		parameterName: 'select',
	})
	@IsObject()
	@IsOnlyOnePresent({ optionalFields: ['include', 'select'] })
	select?: UserSelect;
}
