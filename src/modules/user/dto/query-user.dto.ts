import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';
import { Transform } from 'class-transformer';
import { BadRequestException } from '@nestjs/common';
import { type UserInclude } from '../user.types';

export class QueryUserDto {
	@ApiProperty({
		description:
			'JSON string for Prisma `includ` object. Allows fetching related data.',
		example: '{"teacherProfile": true, "favouriteQuizzes": true }',
		required: false,
	})
	@IsOptional()
	@IsString()
	@Transform(({ value }) => {
		try {
			return JSON.parse(value as string);
		} catch {
			throw new BadRequestException(
				'Invalid "includ" query parameter: must be a valid JSON string.',
			);
		}
	})
	include?: UserInclude;
}
