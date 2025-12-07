import { EntityNotFoundError, Repository } from 'typeorm';
import { Quiz, QuizAccess } from './entities';
import { InjectRepository } from '@nestjs/typeorm';
import {
	PaginatedQuizAccessResponse,
	QuizAccessCreateDto,
	QuizAccessGetAllQueryDto,
	QuizAccessTransferOwnershipDto,
	QuizAccessUpdateDto,
} from './dto';
import { QuizAccessType } from './enums';
import {
	ConflictException,
	ForbiddenException,
	Injectable,
	NotFoundException,
} from '@nestjs/common';
import { createPaginatedResponse } from '@common/utils';

@Injectable()
export class QuizAccessService {
	constructor(
		@InjectRepository(QuizAccess)
		private readonly quizAccessRepository: Repository<QuizAccess>,
		@InjectRepository(Quiz)
		private readonly quizRepository: Repository<Quiz>,
	) {}

	private async checkIsTeacherOwner(teacherId: string, quizId: string) {
		try {
			await this.quizAccessRepository.findOneOrFail({
				where: {
					teacher: { id: teacherId },
					quiz: { id: quizId },
					accessType: QuizAccessType.OWNER,
				},
			});
			return true;
		} catch (error) {
			if (error instanceof EntityNotFoundError) {
				throw new ForbiddenException(
					'You cannot modify an access of the quiz to which you are not an owner!',
				);
			}
		}
	}

	async grantAccess(
		teacherId: string,
		quizId: string,
		dto: QuizAccessCreateDto,
	) {
		await this.checkIsTeacherOwner(teacherId, quizId);

		const existingAccess = await this.quizAccessRepository.findOne({
			where: {
				teacher: { id: dto.teacherId },
				quiz: { id: quizId },
			},
		});

		if (existingAccess) {
			throw new ConflictException(
				'This teacher already has access. You can only modify existing access.',
			);
		}

		const newAccess = this.quizAccessRepository.create({
			teacher: { id: dto.teacherId },
			quiz: { id: quizId },
			accessType: dto.accessType,
		});
		return this.quizAccessRepository.save(newAccess);
	}

	async updateAccess(
		teacherId: string,
		quizId: string,
		accessId: string,
		dto: QuizAccessUpdateDto,
	) {
		await this.checkIsTeacherOwner(teacherId, quizId);

		const access = await this.quizAccessRepository.findOne({
			where: { id: accessId },
		});
		if (!access) throw new NotFoundException('Access does not exist!');

		return this.quizAccessRepository.save({
			id: access.id,
			accessType: dto.accessType,
		});
	}
	async revokeAccess(teacherId: string, quizId: string, accessId: string) {
		await this.checkIsTeacherOwner(teacherId, quizId);

		const access = await this.quizAccessRepository.findOne({
			where: { id: accessId },
		});
		if (!access) throw new NotFoundException('Access does not exist!');
		return this.quizAccessRepository.remove(access);
	}
	async transferOwnership(
		teacherId: string,
		quizId: string,
		dto: QuizAccessTransferOwnershipDto,
	) {
		await this.checkIsTeacherOwner(teacherId, quizId);
		const oldOwnerAccess = await this.quizAccessRepository.findOne({
			where: {
				quiz: {
					id: quizId,
				},
				teacher: { id: teacherId },
			},
		});
		if (!oldOwnerAccess)
			throw new NotFoundException('Access does not exist!');
		const newOwnerAccess = this.quizAccessRepository.create({
			quiz: { id: quizId },
			teacher: { id: dto.teacherId },
			accessType: QuizAccessType.OWNER,
		});

		await this.quizAccessRepository.save({
			...oldOwnerAccess,
			accessType: QuizAccessType.EDITOR,
		});
		return this.quizAccessRepository.save(newOwnerAccess);
	}
	async getAllAccessesByQuiz(
		teacherId: string,
		quizId: string,
		dto: QuizAccessGetAllQueryDto,
	): Promise<PaginatedQuizAccessResponse> {
		const [accesses, total] = await this.quizAccessRepository.findAndCount({
            where: {
                quiz: {id: quizId}
            },
			relations: {
				quiz: dto.withQuiz,
				teacher: dto.withTeacherProfile
					? {
							user: dto.withUserProfile,
						}
					: false,
			},
		});
		return createPaginatedResponse(accesses, {
			total,
			page: dto.page,
			perPage: dto.perPage,
		});
	}
}
