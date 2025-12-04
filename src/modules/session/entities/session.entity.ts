import {
	Entity,
	PrimaryGeneratedColumn,
	Column,
	ManyToOne,
	OneToMany,
	CreateDateColumn,
	UpdateDateColumn,
} from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { SessionStatus } from '../enums/session-status.enum';

import { Quiz } from '@modules/quiz/entities';
import { SessionParticipant } from './session-participant.entity';
import { SessionQuestion } from './session-question.entity';
import { Report } from '@modules/report/entities';

@Entity('sessions')
export class Session {
	@ApiProperty()
	@PrimaryGeneratedColumn('uuid')
	id: string;

	@ApiProperty()
	@Column()
	name: string;

	@ApiProperty({ enum: SessionStatus })
	@Column({
		type: 'enum',
		enum: SessionStatus,
		default: SessionStatus.WAITING,
	})
	status: SessionStatus;

	@ApiProperty()
	@Column({ default: false })
	shuffleQuestions: boolean;

	@ApiProperty()
	@Column({ default: false })
	shuffleAnswers: boolean;

	@ManyToOne(() => Quiz, (quiz) => quiz.sessions)
	quiz: Quiz;

	@OneToMany(() => SessionParticipant, (p) => p.session)
	participants: SessionParticipant[];

	@OneToMany(() => SessionQuestion, (q) => q.session, { cascade: true })
	questions: SessionQuestion[];

	@OneToMany(() => Report, (report) => report.session)
	reports: Report[];

	@CreateDateColumn()
	createdAt: Date;

	@UpdateDateColumn()
	updatedAt: Date;
}
