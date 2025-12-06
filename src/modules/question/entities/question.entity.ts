import {
	Entity,
	PrimaryGeneratedColumn,
	Column,
	ManyToOne,
	OneToMany,
	ManyToMany,
	CreateDateColumn,
	UpdateDateColumn,
} from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { QuestionType } from '../enums/question-type.enum';
import { TeacherProfile } from '@modules/user/entities';
import { QuestionToQuiz } from './question-to-quiz.entity';

@Entity('questions')
export class Question {
	@ApiProperty()
	@PrimaryGeneratedColumn('uuid')
	id: string;

	@ApiProperty({ enum: QuestionType })
	@Column({
		type: 'enum',
		enum: QuestionType,
		default: QuestionType.SINGLE_CHOICE,
	})
	type: QuestionType;

	@ApiProperty({
		description: 'Dynamic JSON content depending on question type',
	})
	@Column({ type: 'jsonb' })
	data: JSON;

	@OneToMany(() => QuestionToQuiz, (q2q) => q2q.question)
	quizzes: QuestionToQuiz[];

	@ManyToOne(() => TeacherProfile, (teacher) => teacher.createdQuestions)
	creator: TeacherProfile;

	@ManyToMany(() => TeacherProfile, (teacher) => teacher.favouriteQuestions)
	favouritedBy: TeacherProfile[];

	@CreateDateColumn()
	createdAt: Date;

	@UpdateDateColumn()
	updateAt: Date;
}
