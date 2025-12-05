import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, MaxLength, MinLength } from 'class-validator';

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
