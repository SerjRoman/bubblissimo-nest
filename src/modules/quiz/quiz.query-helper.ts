import { Brackets, DataSource, SelectQueryBuilder } from 'typeorm';
import { Quiz } from './entities';
import { QuizAccessType, QuizStatus, TeacherViewType } from './enums';
import { QuizCopyDto, QuizGetAllQueryDto } from './dto';

export class QuizQueryHelper {
	public static createBaseQuery(
		qb: SelectQueryBuilder<Quiz>,
		userId: string,
	): SelectQueryBuilder<Quiz> {
		qb.leftJoinAndSelect('quiz.creator', 'creator')
			.leftJoinAndSelect('quiz.owner', 'owner')
			.leftJoinAndSelect('owner.user', 'userOwner')
			.leftJoinAndSelect('creator.user', 'userCreator')
			.leftJoinAndSelect('quiz.subject', 's');
		// qb.addSelect([
		// 	'userCreator.id',
		// 	'userCreator.username',
		// 	'userCreator.avatar',
		// 	'userCreator.email',
		// 	'userCreator.firstName',
		// 	'userCreator.lastName',
		// ]);
		// qb.addSelect([
		// 	'userOwner.id',
		// 	'userOwner.username',
		// 	'userOwner.avatar',
		// 	'userOwner.email',
		// 	'userOwner.firstName',
		// 	'userOwner.lastName',
		// ]);
		qb.loadRelationCountAndMap(
			'quiz.isFavourite',
			'quiz.favouritedBy',
			'fav',
			(subQb) => subQb.andWhere('fav.id = :userId', { userId }),
		);

		return qb;
	}
	public static applyTeacherViewScope(
		qb: SelectQueryBuilder<Quiz>,
		viewType: TeacherViewType,
		teacherId: string,
		userId: string,
	): SelectQueryBuilder<Quiz> {
		qb.leftJoin('quiz.accesses', 'accesses').leftJoin(
			'quiz.favouritedBy',
			'favouritedBy',
		);
		switch (viewType) {
			case TeacherViewType.ALL:
				qb.andWhere(
					new Brackets((sub) => {
						sub.where('quiz.owner = :teacherId', {
							teacherId,
						})
							.orWhere('accesses.teacherId = :teacherId', {
								teacherId,
							})
							.orWhere('quiz.creator = :teacherId', {
								teacherId,
							});
					}),
				);
				break;

			case TeacherViewType.CREATED:
				qb.andWhere('quiz.creator = :teacherId', { teacherId });
				break;

			case TeacherViewType.COPIED:
				qb.andWhere('quiz.owner = :teacherId', {
					teacherId,
				}).andWhere('quiz.originalQuizId IS NOT NULL');
				break;

			case TeacherViewType.FAVOURITE:
				qb.andWhere('favouritedBy.id = :userId', { userId });
				break;

			case TeacherViewType.ACCESSED:
				qb.andWhere('accesses.teacherId = :teacherId', { teacherId });
				break;
		}
		return qb;
	}
	public static applyFiltersAndSort(
		qb: SelectQueryBuilder<Quiz>,
		dto: QuizGetAllQueryDto,
	) {
		const {
			search,
			tagIds,
			languageIds,
			subjectId,
			status,
			visibility,
			order,
		} = dto;

		if (search) {
			qb.andWhere('quiz.title ILIKE :search', { search: `%${search}%` });
		}
		if (subjectId) {
			qb.leftJoin('quiz.subject', 'subject');
			qb.andWhere('subject.id = :subjectId', { subjectId });
		}
		if (status) {
			qb.andWhere('quiz.status = :status', { status });
		}
		if (visibility) {
			qb.andWhere('quiz.visibility = :visibility', { visibility });
		}
		if (tagIds && tagIds.length > 0) {
			qb.leftJoin('quiz.tags', 'tags');
			qb.andWhere('tags.id IN (:...tagIds)', { tagIds });
		}
		if (languageIds && languageIds.length > 0) {
			qb.leftJoin('quiz.languages', 'languages');
			qb.andWhere('languages.id IN (:...languageIds)', { languageIds });
		}

		if (order) {
			const [field] = Object.keys(order);
			qb.orderBy(
				`quiz.${field}`,
				order[field] === 'asc' ? 'ASC' : 'DESC',
			);
		} else {
			qb.orderBy('quiz.createdAt', 'DESC');
		}
	}

	public static applyPagination(
		qb: SelectQueryBuilder<Quiz>,
		page: number,
		perPage: number,
	) {
		qb.skip((page - 1) * perPage).take(perPage);

		return qb;
	}
	public static copyQuizAndUpdateOriginalCopies(
		dataSource: DataSource,
		dto: QuizCopyDto,
		teacherId: string,
	) {
		return dataSource.transaction(async (manager) => {
			const originalQuiz = await manager.findOneOrFail(Quiz, {
				where: { id: dto.quizId },
				relations: {
					tags: true,
					languages: true,
					subject: true,
					questions: { question: true },
					creator: true,
				},
			});

			const copiedQuiz = manager.create(Quiz, {
				title: `Copy of ${originalQuiz.title}`,
				tags: originalQuiz.tags,
				languages: originalQuiz.languages,
				subject: originalQuiz.subject,

				creator: { id: originalQuiz.creator.id },
				owner: { id: teacherId },

				visibility: originalQuiz.visibility,
				status: QuizStatus.DRAFT,
				shuffleAnswers: originalQuiz.shuffleAnswers,
				shuffleQuestions: originalQuiz.shuffleQuestions,
				accesses: [
					{
						teacher: { id: teacherId },
						accessType: QuizAccessType.OWNER,
					},
				],
				originalQuiz: { id: originalQuiz.id },
				questions: originalQuiz.questions.map((originalQ2Q) => {
					return {
						time: originalQ2Q.time,
						order: originalQ2Q.order,
						question: {
							type: originalQ2Q.question.type,
							data: originalQ2Q.question.data,
						},
					};
				}),
			});
			const savedCopyOfQuiz = manager.save(Quiz, copiedQuiz);

			await manager
				.getRepository(Quiz)
				.createQueryBuilder()
				.relation(Quiz, 'copies')
				.of(originalQuiz.id)
				.add(savedCopyOfQuiz);
			return savedCopyOfQuiz;
		});
	}
}
