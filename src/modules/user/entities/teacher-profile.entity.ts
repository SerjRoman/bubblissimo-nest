import {
	Entity,
	PrimaryGeneratedColumn,
	OneToOne,
	JoinColumn,
	OneToMany,
	ManyToMany,
	JoinTable,
} from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { User } from './user.entity';

import { Quiz, QuizAccess, QuizFolder } from '@modules/quiz/entities';
import { ClassroomTeacher } from '@modules/classroom/entities';
import { Question } from '@modules/question/entities';

@Entity('teacher_profiles')
export class TeacherProfile {
	@ApiProperty({ example: 'uuid-string' })
	@PrimaryGeneratedColumn('uuid')
	id: string;

	@OneToOne(() => User, (user) => user.teacherProfile, {
		onDelete: 'CASCADE',
	})
	@JoinColumn({ name: 'userId' })
	user: User;

	@ApiProperty({ description: 'Quizzes created by this teacher' })
	@OneToMany(() => Quiz, (quiz) => quiz.creator)
	createdQuizzes: Quiz[];

	@ApiProperty({
		description:
			'Quizzes currently owned by this teacher (might be transferred)',
	})
	@OneToMany(() => Quiz, (quiz) => quiz.owner)
	ownedQuizzes: Quiz[];

	@ApiProperty({ description: 'Quizzes copied from other sources' })
	@ManyToMany(() => Quiz)
	@JoinTable({ name: 'teacher_copied_quizzes' })
	copiedQuizzes: Quiz[];

	@OneToMany(() => QuizFolder, (folder) => folder.owner)
	quizFolders: QuizFolder[];

	@OneToMany(() => ClassroomTeacher, (ct) => ct.teacher)
	classroomMemberships: ClassroomTeacher[];

	@OneToMany(() => QuizAccess, (access) => access.teacher)
	accesses: QuizAccess[];

	@OneToMany(() => Question, (question) => question.creator)
	createdQuestions: Question[];

	@ManyToMany(() => Question)
	@JoinTable({ name: 'teacher_favourite_questions' })
	favouriteQuestions: Question[];
}
