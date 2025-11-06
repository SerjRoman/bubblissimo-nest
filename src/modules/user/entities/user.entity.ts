import { ApiProperty, IntersectionType, PartialType } from '@nestjs/swagger';
import {
	UserWithoutPassword,
	UserRolesEnum,
	UserWithInclude,
} from '../user.types';
import {
	QuizVisibility,
	QuizStatus,
	NotificationType,
	Role,
} from '#prisma/enums';

export class UserEntity implements UserWithoutPassword {
	@ApiProperty()
	id: string;

	@ApiProperty()
	email: string;

	@ApiProperty()
	username: string;

	@ApiProperty()
	firstName: string;

	@ApiProperty()
	lastName: string;

	@ApiProperty({ nullable: true })
	avatar: string | null;

	@ApiProperty()
	createdAt: Date;

	@ApiProperty()
	updatedAt: Date;

	@ApiProperty()
	favouriteQuzzesIds: string[];

	@ApiProperty({ type: 'array', enum: UserRolesEnum })
	roles: Role[];
}

export class UserRelations
	extends UserEntity
	implements
		Omit<
			UserWithInclude<{
				teacherProfile: true;
				studentProfile: true;
				favourite: true;
				notifications: true;
			}>,
			'password'
		>
{
	@ApiProperty()
	favourite: {
		title: string;
		id: string;
		createdAt: Date;
		updatedAt: Date;
		visibility: QuizVisibility;
		status: QuizStatus;
		coverImage: string | null;
		tagsIds: string[];
		languagesIds: string[];
		shuffleAnswers: boolean;
		shuffleQuestions: boolean;
		subjectId: string;
		favouritedByIds: string[];
		createdById: string;
		ownedById: string;
		copiedByIds: string[];
		originalQuizId: string | null;
		completedByIds: string[];
		folderIds: string[];
	}[];
	@ApiProperty()
	notifications: {
		type: NotificationType;
		id: string;
		createdAt: Date;
		updatedAt: Date;
		userId: string;
		content: string;
		read: boolean;
	}[];
	@ApiProperty()
	teacherProfile: {
		id: string;
		copiedQuizzesIds: string[];
		userId: string;
		favouriteQuestionsIds: string[];
	} | null;
	@ApiProperty()
	studentProfile: {
		id: string;
		userId: string;
		completedQuizzesIds: string[];
	} | null;
}
export class UserEntityWithRelations extends IntersectionType(
	UserEntity,
	UserRelations,
) {}

export class PartialUserEntity extends PartialType(UserEntityWithRelations) {}
