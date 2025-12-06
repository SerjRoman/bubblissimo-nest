import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
	IsArray,
	IsNotEmpty,
	IsString,
	MaxLength,
	MinLength,
	ValidateNested,
} from 'class-validator';

export class TagCreateDto {
	@ApiProperty({ example: 'Mathematics', description: 'Unique tag name' })
	@IsString()
	@IsNotEmpty()
	@MinLength(3)
	@MaxLength(50)
	name: string;

	@ApiProperty({ example: 'mathematics', description: 'URL-friendly slug' })
	@IsString()
	@IsNotEmpty()
	@MinLength(3)
	@MaxLength(50)
	slug: string;
}
export class TagsCreateDto {
	@ApiProperty({ type: [TagCreateDto] })
	@IsArray()
	@ValidateNested({ each: true })
	@Type(() => TagCreateDto)
	tags: TagCreateDto[];
}
export class LanguageCreateDto {
	@ApiProperty({ example: 'English', description: 'Unique language name' })
	@IsString()
	@IsNotEmpty()
	@MinLength(3)
	@MaxLength(50)
	name: string;

	@ApiProperty({ example: 'english', description: 'URL-friendly slug' })
	@IsString()
	@IsNotEmpty()
	@MinLength(3)
	@MaxLength(50)
	slug: string;
}
export class LanguagesCreateDto {
	@ApiProperty({ type: [LanguageCreateDto] })
	@IsArray()
	@ValidateNested({ each: true })
	@Type(() => LanguageCreateDto)
	languages: LanguageCreateDto[];
}
export class SubjectCreateDto {
	@ApiProperty({ example: 'Mathematics', description: 'Unique subject name' })
	@IsString()
	@IsNotEmpty()
	@MinLength(3)
	@MaxLength(50)
	name: string;

	@ApiProperty({ example: 'mathematics', description: 'URL-friendly slug' })
	@IsString()
	@IsNotEmpty()
	@MinLength(3)
	@MaxLength(50)
	slug: string;
}
export class SubjectsCreateDto {
	@ApiProperty({ type: [SubjectCreateDto] })
	@IsArray()
	@ValidateNested({ each: true })
	@Type(() => SubjectCreateDto)
	subjects: SubjectCreateDto[];
}
