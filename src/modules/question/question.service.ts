import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { Question } from './entities';
import { InjectRepository } from '@nestjs/typeorm';
import { Quiz } from '@modules/quiz/entities';
import {
	PaginatedQuestionGetAllResponse,
	QuestionGetAllQueryDto,
	QuestionGetAllResponseDto,
} from './dto';
import { createPaginatedResponse } from '@common/utils';
import { plainToInstance } from 'class-transformer';

@Injectable()
export class QuestionService {
	constructor(
		@InjectRepository(Question)
		private readonly questionRepository: Repository<Question>,
		@InjectRepository(Quiz)
		private readonly quizRepository: Repository<Quiz>,
	) {}

	async getAllByQuizId(
		quizId: string,
		dto: QuestionGetAllQueryDto,
	): Promise<PaginatedQuestionGetAllResponse> {
		const [questions, total] = await this.questionRepository.findAndCount({
			where: { quizzes: { quiz: { id: quizId } } },
			relations: {
				quizzes: true,
			},
		});
		const transformedQuestions = questions.map((q) => ({
			...q,
			...q.quizzes,
		}));
		const plainQuestions = plainToInstance(
			QuestionGetAllResponseDto,
			transformedQuestions,
            
		);

		return createPaginatedResponse(plainQuestions, {
			page: dto.page,
			perPage: dto.perPage,
			total,
		});
	}
}
