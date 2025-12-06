import { Controller, Get, Param, Query } from '@nestjs/common';
import { QuestionService } from './question.service';
import { PaginatedQuestionGetAllResponse, QuestionGetAllQueryDto } from './dto';
import { QuestionGetByQuizParamDto } from './dto/params';

@Controller('questions')
export class QuestionController {
	constructor(private readonly questionService: QuestionService) {}

	@Get('quiz/:id')
	async getAllByQuizId(
		@Param() { quizId }: QuestionGetByQuizParamDto,
		@Query() query: QuestionGetAllQueryDto,
	): Promise<PaginatedQuestionGetAllResponse> {
		return this.questionService.getAllByQuizId(quizId, query);
	}
}
