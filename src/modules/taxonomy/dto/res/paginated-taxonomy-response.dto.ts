import { CreatePaginatedResponseDto } from '@common/dto';
import { Language, Subject, Tag } from '../../entities';

export class PaginatedLanguageResponseDto extends CreatePaginatedResponseDto(
	Language,
) {}
export class PaginatedTagResponseDto extends CreatePaginatedResponseDto(Tag) {}
export class PaginatedSubjectResponseDto extends CreatePaginatedResponseDto(
	Subject,
) {}
