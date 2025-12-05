import { InjectRepository } from '@nestjs/typeorm';
import { Quiz } from './entities';
import { DataSource, Repository } from 'typeorm';
import { QuizAccessType, TeacherViewType } from './enums';
import { QuizQueryHelper } from './quiz.query-helper';
import { PaginatedResult } from '@common/types';
import {
	QuizCreateDto,
	QuizGetAllQueryDto,
	QuizToggleFavouriteDto,
	QuizCopyDto,
} from './dto';
import { createPaginatedResponse } from '@common/utils';
import { ForbiddenException, NotFoundException } from '@nestjs/common';
import { User } from '@modules/user/entities';

export class QuizService {
	constructor(
		@InjectRepository(Quiz)
		private readonly quizRepository: Repository<Quiz>,
		@InjectRepository(User)
		private readonly userRepository: Repository<User>,
		private dataSource: DataSource,
	) {}

	async getAllForTeacher(
		userId: string,
		teacherId: string,
		viewType: TeacherViewType,
		dto: QuizGetAllQueryDto,
	): Promise<PaginatedResult<Quiz>> {
		const queryBuilder = this.quizRepository.createQueryBuilder('quiz');
		QuizQueryHelper.createBaseQuery(queryBuilder, userId);
		QuizQueryHelper.applyTeacherViewScope(
			queryBuilder,
			viewType,
			teacherId,
			userId,
		);
		QuizQueryHelper.applyPagination(queryBuilder, dto.page, dto.perPage);
		QuizQueryHelper.applyFiltersAndSort(queryBuilder, dto);

		const [quizzes, total] = await queryBuilder.getManyAndCount();
		const enrichedQuizzes = quizzes.map((quiz) => ({
			...quiz,
			isFavourite: !!quiz.isFavourite,
		}));
		return createPaginatedResponse(enrichedQuizzes, {
			total,
			perPage: dto.perPage,
			page: dto.page,
		});
	}
	async create(teacherId: string, dto: QuizCreateDto): Promise<Quiz> {
		const tags = dto.tagIds.map((id) => ({ id }));
		const languages = dto.languageIds.map((id) => ({ id }));
		const quiz = this.quizRepository.create({
			...dto,
			languages,
			tags,
			creator: { id: teacherId },
			owner: { id: teacherId },
			accesses: [
				{
					teacher: { id: teacherId },
					accessType: QuizAccessType.OWNER,
				},
			],
		});
		return await this.quizRepository.save(quiz);
	}
	async delete(quizId: string, teacherId: string) {
		const quiz = await this.quizRepository.findOneOrFail({
			where: { id: quizId },
			relations: { owner: true },
		});
		if (quiz?.owner.id !== teacherId) {
			throw new ForbiddenException(
				'You are not allowed to delete the quiz that you do not own',
			);
		}
		return this.quizRepository.remove(quiz);
	}
	async toggleFavourite(userId: string, dto: QuizToggleFavouriteDto) {
		const { quizId } = dto;

		const quizExists = await this.quizRepository.countBy({ id: quizId });
		if (quizExists === 0) {
			throw new NotFoundException(`Quiz with ID "${quizId}" not found.`);
		}

		const relationExists = await this.quizRepository.count({
			where: { id: quizId, favouritedBy: { id: userId } },
		});

		const relationQuery = this.quizRepository
			.createQueryBuilder()
			.relation(Quiz, 'favouritedBy')
			.of(quizId);

		if (relationExists > 0) {
			await relationQuery.remove(userId);
		} else {
			await relationQuery.add(userId);
		}

		const isNowFavourited = relationExists === 0;

		return {
			isFavourited: isNowFavourited,
			message: isNowFavourited
				? 'Quiz added to favourites.'
				: 'Quiz removed from favourites.',
		};
	}

	async copyQuiz(userId: string, teacherId: string, dto: QuizCopyDto) {
		const user = await this.userRepository.findOneOrFail({
			where: { id: userId },
			relations: { teacherProfile: true },
		});
		if (!user.teacherProfile) {
			throw new ForbiddenException(
				'Cannot copy quiz without a TeacherProfile.',
			);
		}
		return QuizQueryHelper.copyQuizAndUpdateOriginalCopies(
			this.dataSource,
			dto,
			teacherId,
		);
	}
}
