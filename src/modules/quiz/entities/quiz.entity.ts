import {
	Entity,
	PrimaryGeneratedColumn,
	Column,
	CreateDateColumn,
	UpdateDateColumn,
	ManyToOne,
	OneToMany,
	ManyToMany,
	JoinTable,
} from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { QuizStatus } from '../enums/quiz-status.enum';
import { QuizVisibility } from '../enums/quiz-visibility.enum';

import { QuizFolder } from './quiz-folder.entity';
import { QuizAccess } from './quiz-access.entity';

import { Tag, Language, Subject } from '@modules/taxonomy/entities';
import { QuestionToQuiz } from './question-to-quiz.entity';
import { TeacherProfile, User, StudentProfile } from '@modules/user/entities';
import { Session } from '@modules/session/entities';

@Entity('quizzes')
export class Quiz {
	@ApiProperty()
	@PrimaryGeneratedColumn('uuid')
	id: string;

	@ApiProperty()
	@Column()
	title: string;

	@ApiProperty({ enum: QuizVisibility })
	@Column({
		type: 'enum',
		enum: QuizVisibility,
		default: QuizVisibility.PRIVATE,
	})
	visibility: QuizVisibility;

	@ApiProperty({ enum: QuizStatus })
	@Column({ type: 'enum', enum: QuizStatus, default: QuizStatus.DRAFT })
	status: QuizStatus;

	@ApiProperty({ required: false, nullable: true })
	@Column({ nullable: true })
	coverImage: string;

	@ApiProperty()
	@Column({ default: false })
	shuffleAnswers: boolean;

	@ApiProperty()
	@Column({ default: false })
	shuffleQuestions: boolean;

	// --- Taxonomy Relations ---

	@ApiProperty({ type: () => [Tag] })
	@ManyToMany(() => Tag)
	@JoinTable({ name: 'quiz_tags' })
	tags: Tag[];

	@ApiProperty({ type: () => [Language] })
	@ManyToMany(() => Language)
	@JoinTable({ name: 'quiz_languages' })
	languages: Language[];

	@ApiProperty({ type: () => Subject, nullable: false })
	@ManyToOne(() => Subject, (s) => s.quizzes, {
		nullable: false,
		onDelete: 'CASCADE',
	})
	subject: Subject;

	// --- User Relations ---

	@ManyToOne(() => TeacherProfile, (p) => p.createdQuizzes)
	creator: TeacherProfile;

	@ManyToOne(() => TeacherProfile, (p) => p.ownedQuizzes)
	owner: TeacherProfile;

	@ManyToMany(() => TeacherProfile, (p) => p.copiedQuizzes)
	copiedBy: TeacherProfile[];

	@ManyToMany(() => User, (u) => u.favouriteQuizzes)
	@JoinTable({
		name: 'quiz_favourites',
	})
	favouritedBy: User[];

	@ManyToMany(() => StudentProfile, (s) => s.completedQuizzes)
	completedBy: StudentProfile[];

	// --- Self-Reference (Original vs Copies) ---

	@ManyToOne(() => Quiz, (q) => q.copies, {
		nullable: true,
		onDelete: 'SET NULL',
	})
	originalQuiz: Quiz;

	@OneToMany(() => Quiz, (q) => q.originalQuiz, { onDelete: 'SET NULL' })
	copies: Quiz[];

	// --- Internal Quiz Relations ---

	@ManyToMany(() => QuizFolder, (folder) => folder.quizzes)
	folders: QuizFolder[];

	@OneToMany(() => QuizAccess, (access) => access.quiz, { cascade: true })
	accesses: QuizAccess[];

	@OneToMany(() => QuestionToQuiz, (q2q) => q2q.quiz, { cascade: true })
	questions: QuestionToQuiz[];

	@OneToMany(() => Session, (session) => session.quiz)
	sessions: Session[];

	@CreateDateColumn()
	createdAt: Date;

	@UpdateDateColumn()
	updatedAt: Date;

	isFavourite: boolean;
}
