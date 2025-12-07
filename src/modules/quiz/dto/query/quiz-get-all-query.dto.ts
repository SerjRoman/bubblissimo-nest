import {
	CreateOrderQueryDto,
	PaginationDto,
	SearchQueryDto,
} from '@common/dto';
import { QUIZ_ORDER_FIELDS } from '../../quiz.constants';
import { IntersectionType, ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsArray, IsString, IsEnum } from 'class-validator';
import { Transform } from 'class-transformer';
import { QuizStatus, QuizVisibility } from '../../enums/';

export class QuizOrderByQueryDto extends CreateOrderQueryDto(
	QUIZ_ORDER_FIELDS,
) {}

export class QuizFilterQueryDto {
	@ApiPropertyOptional({
		description:
			'Filter by tags. Can be a single tag or a comma-separated list.',
		example: ['math', 'algebra'],
		type: String,
		isArray: true,
	})
	@IsOptional()
	@IsArray()
	@IsString({ each: true })
	@Transform(({ value }) =>
		typeof value === 'string' ? value.split(',') : value,
	)
	tagIds?: string[];

	@ApiPropertyOptional({
		description: 'Filter by languages .',
		example: ['English', 'Spanish'],
		type: String,
		isArray: true,
	})
	@IsOptional()
	@IsArray()
	@IsString({ each: true })
	@Transform(({ value }) =>
		typeof value === 'string' ? value.split(',') : value,
	)
	languageIds?: string[];

	@ApiPropertyOptional({
		description: 'Filter by subject name.',
		example: 'Mathematics',
	})
	@IsOptional()
	@IsString()
	subjectId?: string;

	@ApiPropertyOptional({
		description: 'Filter by quiz visibility.',
		enum: QuizVisibility,
		example: QuizVisibility.PUBLIC,
	})
	@IsOptional()
	@Transform(({ value }) => (typeof value === 'string' ? [value] : value))
	@IsArray()
	@IsEnum(QuizVisibility, { each: true })
	visibility?: QuizVisibility[];

	@ApiPropertyOptional({
		description: 'Filter by quiz status.',
		enum: QuizStatus,
		example: QuizStatus.PUBLISHED,
	})
	@IsOptional()
	@Transform(({ value }) => (typeof value === 'string' ? [value] : value))
	@IsArray()
	@IsEnum(QuizStatus, { each: true })
	status?: QuizStatus[];
}

export class QuizGetAllQueryDto extends IntersectionType(
	PaginationDto,
	QuizFilterQueryDto,
	SearchQueryDto,
	QuizOrderByQueryDto,
) {}
