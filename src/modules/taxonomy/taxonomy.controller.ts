import { Body, Controller, Get, Post, Query, UseGuards } from '@nestjs/common';
import { TaxonomyService } from './taxonomy.service';
import {
	LanguageCreateDto,
	LanguagesCreateDto,
	PaginatedLanguageResponseDto,
	PaginatedSubjectResponseDto,
	PaginatedTagResponseDto,
	SubjectCreateDto,
	SubjectsCreateDto,
	TagCreateDto,
	TagsCreateDto,
	TaxonomyQueryDto,
} from './dto';
import {
	ApiBearerAuth,
	ApiCreatedResponse,
	ApiOkResponse,
	ApiOperation,
	ApiTags,
} from '@nestjs/swagger';
import { Language, Subject, Tag } from './entities';
import { JwtAuthGuard } from '@auth/index';
@ApiTags('Taxonomies (Tags, Languages, Subjects)')
@ApiBearerAuth()
@Controller('taxonomies')
@UseGuards(JwtAuthGuard)
export class TaxonomyController {
	constructor(private readonly taxonomyService: TaxonomyService) {}

	@Get('tags')
	@ApiOperation({ summary: 'Get a list of all tags' })
	@ApiOkResponse({
		description: 'A paginated list of tags.',
		type: PaginatedTagResponseDto,
	})
	async getAllTags(@Query() query: TaxonomyQueryDto) {
		return this.taxonomyService.getAllTags(query);
	}

	@Get('languages')
	@ApiOperation({ summary: 'Get a list of all languages' })
	@ApiOkResponse({
		description: 'A paginated list of languages.',
		type: PaginatedLanguageResponseDto,
	})
	async getAllLanguages(@Query() query: TaxonomyQueryDto) {
		return this.taxonomyService.getAllLanguages(query);
	}

	@Get('subjects')
	@ApiOperation({ summary: 'Get a list of all subjects' })
	@ApiOkResponse({
		description: 'A paginated list of subjects.',
		type: PaginatedSubjectResponseDto,
	})
	async getAllSubjects(@Query() query: TaxonomyQueryDto) {
		return this.taxonomyService.getAllSubjects(query);
	}

	@Post('tags')
	@ApiOperation({ summary: 'Create a new tag' })
	@ApiCreatedResponse({
		description: 'The tag was successfully created.',
		type: Tag,
	})
	async createTag(@Body() body: TagCreateDto): Promise<Tag> {
		const [createdTag] = await this.taxonomyService.createTags([body]);
		return createdTag;
	}

	@Post('tags/bulk')
	@ApiOperation({ summary: 'Create multiple tags' })
	@ApiCreatedResponse({
		description: 'The tags were successfully created.',
		type: [Tag],
	})
	async createManyTags(@Body() body: TagsCreateDto): Promise<Tag[]> {
		return this.taxonomyService.createTags(body.tags);
	}

	@Post('languages')
	@ApiOperation({ summary: 'Create a new language' })
	@ApiCreatedResponse({
		description: 'The language was successfully created.',
		type: Language,
	})
	async createLanguage(@Body() body: LanguageCreateDto): Promise<Language> {
		const [createdLanguage] = await this.taxonomyService.createLanguages([
			body,
		]);
		return createdLanguage;
	}

	@Post('languages/bulk')
	@ApiOperation({ summary: 'Create multiple languages' })
	@ApiCreatedResponse({
		description: 'The languages were successfully created.',
		type: [Language],
	})
	async createManyLanguages(
		@Body() body: LanguagesCreateDto,
	): Promise<Language[]> {
		return this.taxonomyService.createLanguages(body.languages);
	}

	@Post('subjects')
	@ApiOperation({ summary: 'Create a new subject' })
	@ApiCreatedResponse({
		description: 'The subject was successfully created.',
		type: Subject,
	})
	async createSubject(@Body() body: SubjectCreateDto): Promise<Subject> {
		const [createdSubject] = await this.taxonomyService.createSubjects([
			body,
		]);
		return createdSubject;
	}

	@Post('subjects/bulk')
	@ApiOperation({ summary: 'Create multiple subjects' })
	@ApiCreatedResponse({
		description: 'The subjects were successfully created.',
		type: [Subject],
	})
	async createManySubjects(
		@Body() body: SubjectsCreateDto,
	): Promise<Subject[]> {
		return this.taxonomyService.createSubjects(body.subjects);
	}
}
