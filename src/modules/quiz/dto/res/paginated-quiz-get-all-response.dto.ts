import { CreatePaginatedResponseDto } from '@common/dto';
import { QuizSummaryDto } from '../quiz-summary.dto';

export class PaginatedQuizGetAllResponse extends CreatePaginatedResponseDto(
	QuizSummaryDto,
) {}
