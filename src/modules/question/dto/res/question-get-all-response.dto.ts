import { ApiProperty } from '@nestjs/swagger';
import { QuestionType } from '../../enums';
import { QuizSummaryDto } from '@modules/quiz/dto';
import { Type, Expose } from 'class-transformer';
import { CreatePaginatedResponseDto } from '@common/dto';
export class QuestionGetAllResponseDto {
	@ApiProperty()
	@Expose()
	id: string;

	@ApiProperty({ enum: QuestionType })
	@Expose()
	type: QuestionType;

	@ApiProperty({
		description: 'Dynamic JSON content depending on question type',
	})
	@Expose()
	data: JSON;

	@ApiProperty({ description: 'Order of the question in the quiz' })
	@Expose()
	order: number;

	@ApiProperty({
		description: 'Time limit override for this specific quiz context',
		required: false,
	})
	@Expose()
	time: number;

	@ApiProperty({ type: QuizSummaryDto, required: false })
	@Type(() => QuizSummaryDto)
	@Expose()
	quiz: QuizSummaryDto;
}
export class PaginatedQuestionGetAllResponse extends CreatePaginatedResponseDto(
	QuestionGetAllResponseDto,
) {}
