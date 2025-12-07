import { ApiProperty } from '@nestjs/swagger';
import { QuizVisibility } from '../../enums/quiz-visibility.enum';
import {
	IsArray,
	IsBoolean,
	IsEnum,
	IsNotEmpty,
	IsOptional,
	IsString,
	IsUrl,
	IsUUID,
	MaxLength,
	MinLength,
} from 'class-validator';

export class QuizCreateDto {
	@ApiProperty({
		description: 'The title of the quiz',
		example: 'Основы TypeScript',
		minLength: 3,
		maxLength: 100,
	})
	@IsString()
	@MinLength(3)
	@MaxLength(100)
	title: string;

	@ApiProperty({
		description: 'The UUID of the subject this quiz belongs to',
		example: 'a1b2c3d4-e5f6-7890-1234-567890abcdef',
	})
	@IsString()
	@IsNotEmpty()
	@IsUUID('4')
	subjectId: string;

	@ApiProperty({
		description: 'URL for the quiz cover image (optional)',
		example: 'https://example.com/images/quiz-cover.jpg',
		required: false,
	})
	@IsOptional()
	@IsString()
	@IsUrl()
	coverImage?: string;

	@ApiProperty({
		description: 'An array of tag UUIDs to associate with the quiz',
		type: [String],
		example: [
			'123e4567-e89b-12d3-a456-426614174000',
			'987fcdeb-51a2-43d7-9012-345678901234',
		],
	})
	@IsArray()
	@IsUUID('4', { each: true })
	tagIds: string[];

	@ApiProperty({
		description: 'An array of language UUIDs for the quiz',
		type: [String],
		example: [
			'123e4567-e89b-12d3-a456-426614174000',
			'987fcdeb-51a2-43d7-9012-345678901234',
		],
	})
	@IsArray()
	@IsUUID('4', { each: true })
	languageIds: string[];

	@ApiProperty({
		description: 'Whether to shuffle the answers for each question',
		example: false,
		default: false,
	})
	@IsBoolean()
	shuffleAnswers: boolean = false;

	@ApiProperty({
		description: 'Whether to shuffle the order of questions in the quiz',
		example: false,
		default: false,
	})
	@IsBoolean()
	shuffleQuestions: boolean = false;

	@ApiProperty({
		description: 'The visibility of the quiz',
		enum: QuizVisibility,
		enumName: 'QuizVisibility',
		default: QuizVisibility.PRIVATE,
		example: QuizVisibility.PUBLIC,
	})
	@IsEnum(QuizVisibility)
	visibility: QuizVisibility = QuizVisibility.PRIVATE;
}
