import {
	Entity,
	PrimaryGeneratedColumn,
	Column,
	ManyToOne,
	Unique,
} from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { QuizAccessType } from '../enums/quiz-access-type.enum';
import { Quiz } from './quiz.entity';
import { TeacherProfile } from '@modules/user/entities';

@Entity('quiz_accesses')
@Unique(['quiz', 'teacher'])
export class QuizAccess {
	@ApiProperty()
	@PrimaryGeneratedColumn('uuid')
	id: string;

	@ApiProperty({ enum: QuizAccessType, default: QuizAccessType.VIEWER })
	@Column({
		type: 'enum',
		enum: QuizAccessType,
		default: QuizAccessType.VIEWER,
	})
	accessType: QuizAccessType;

	@ManyToOne(() => TeacherProfile, (profile) => profile.accesses, {
		onDelete: 'CASCADE',
	})
	teacher: TeacherProfile;

	@ManyToOne(() => Quiz, (quiz) => quiz.accesses, { onDelete: 'CASCADE' })
	quiz: Quiz;
}
