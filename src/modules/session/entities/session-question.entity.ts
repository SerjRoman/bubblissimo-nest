import {
	Entity,
	PrimaryGeneratedColumn,
	Column,
	ManyToOne,
	OneToMany,
	Unique,
} from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { Session } from './session.entity';
import { SessionParticipantAnswer } from './session-participant-answer.entity';
import { QuestionType } from '@modules/question/enums';

@Entity('session_questions')
@Unique(['session', 'order'])
export class SessionQuestion {
	@PrimaryGeneratedColumn('uuid')
	id: string;

	@ApiProperty({
		description:
			'Reference to the original question ID (if it still exists)',
		required: false,
	})
	@Column({ nullable: true })
	originalQuestionId: string;

	@ApiProperty()
	@Column({ type: 'int' })
	order: number;

	@ApiProperty({ enum: QuestionType })
	@Column({
		type: 'enum',
		enum: QuestionType,
	})
	questionType: QuestionType;

	@ApiProperty({ description: 'Snapshot of question content' })
	@Column({ type: 'jsonb' })
	questionData: JSON;

	@ManyToOne(() => Session, (session) => session.questions, {
		onDelete: 'CASCADE',
	})
	session: Session;

	@OneToMany(
		() => SessionParticipantAnswer,
		(answer) => answer.sessionQuestion,
	)
	answers: SessionParticipantAnswer[];
}
