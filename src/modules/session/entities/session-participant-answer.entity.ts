import {
	Entity,
	PrimaryGeneratedColumn,
	Column,
	ManyToOne,
	CreateDateColumn,
	UpdateDateColumn,
} from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { CorrectType } from '../enums/correct-type.enum';
import { SessionQuestion } from './session-question.entity';
import { SessionParticipant } from './session-participant.entity';

@Entity('session_participant_answers')
export class SessionParticipantAnswer {
	@PrimaryGeneratedColumn('uuid')
	id: string;

	@ApiProperty({
		description: 'The actual answer given by user (indexes, text, etc)',
	})
	@Column({ type: 'jsonb' })
	answer: JSON;

	@ApiProperty()
	@Column({ type: 'float' })
	scored: number;

	@ApiProperty({ description: 'Time taken in milliseconds or seconds' })
	@Column({ type: 'int' })
	timeTaken: number;

	@ApiProperty({ enum: CorrectType })
	@Column({
		type: 'enum',
		enum: CorrectType,
	})
	isCorrect: CorrectType;

	@ManyToOne(() => SessionQuestion, (sq) => sq.answers, {
		onDelete: 'CASCADE',
	})
	sessionQuestion: SessionQuestion;

	@ManyToOne(() => SessionParticipant, (sp) => sp.answers, {
		onDelete: 'CASCADE',
	})
	participant: SessionParticipant;

	@CreateDateColumn()
	createdAt: Date;

	@UpdateDateColumn()
	updatedAt: Date;
}
