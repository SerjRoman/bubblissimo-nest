import { Quiz } from '../entities';
import { CreatePaginatedResponseDto } from '@common/dto';

export class PaginatedQuizResponse extends CreatePaginatedResponseDto(Quiz) {}
