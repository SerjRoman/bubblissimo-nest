import { Injectable } from '@nestjs/common';
import { ILike, Repository } from 'typeorm';
import { Language, Subject, Tag } from './entities';
import { InjectRepository } from '@nestjs/typeorm';
import {
	LanguageCreateDto,
	SubjectCreateDto,
	TagCreateDto,
	TaxonomyQueryDto,
} from './dto';
import { createPaginatedResponse } from '@common/utils';

@Injectable()
export class TaxonomyService {
	constructor(
		@InjectRepository(Tag) private readonly tagRepository: Repository<Tag>,
		@InjectRepository(Language)
		private readonly languageRepository: Repository<Language>,
		@InjectRepository(Subject)
		private readonly subjectRepository: Repository<Subject>,
	) {}

	async getAllTags(dto: TaxonomyQueryDto) {
		const where = dto.search ? { where: { name: ILike(dto.search) } } : {};
		const [tags, total] = await this.tagRepository.findAndCount({
			...where,
			order: dto.order,
			skip: (dto.page - 1) * dto.perPage,
			take: dto.perPage,
		});
		return createPaginatedResponse(tags, {
			total,
			perPage: dto.perPage,
			page: dto.page,
		});
	}
	async getAllLanguages(dto: TaxonomyQueryDto) {
		const where = dto.search ? { where: { name: ILike(dto.search) } } : {};
		const [languages, total] = await this.languageRepository.findAndCount({
			...where,
			order: dto.order,
			skip: (dto.page - 1) * dto.perPage,
			take: dto.perPage,
		});
		return createPaginatedResponse(languages, {
			total,
			perPage: dto.perPage,
			page: dto.page,
		});
	}
	async getAllSubjects(dto: TaxonomyQueryDto) {
		const where = dto.search ? { where: { name: ILike(dto.search) } } : {};
		const [subjects, total] = await this.subjectRepository.findAndCount({
			...where,
			order: dto.order,
			skip: (dto.page - 1) * dto.perPage,
			take: dto.perPage,
		});
		return createPaginatedResponse(subjects, {
			total,
			perPage: dto.perPage,
			page: dto.page,
		});
	}
	async createTags(dto: TagCreateDto[]) {
		const tags = this.tagRepository.create(dto);
		return this.tagRepository.save(tags);
	}
	async createLanguages(dto: LanguageCreateDto[]) {
		const languages = this.languageRepository.create(dto);
		return this.languageRepository.save(languages);
	}
	async createSubjects(dto: SubjectCreateDto[]) {
		const subjects = this.subjectRepository.create(dto);
		return this.subjectRepository.save(subjects);
	}
}
