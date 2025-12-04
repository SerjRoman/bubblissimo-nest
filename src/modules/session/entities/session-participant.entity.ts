import {
	Entity,
	PrimaryGeneratedColumn,
	Column,
	ManyToOne,
	OneToMany,
	Unique,
	JoinColumn,
} from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { ParticipantType } from '../enums/participant-type.enum';

import { Session } from './session.entity';
import { SessionParticipantAnswer } from './session-participant-answer.entity';
import { StudentProfile } from '@modules/user/entities';

@Entity('session_participants')
@Unique(['session', 'studentProfile'])
@Unique(['session', 'name'])
export class SessionParticipant {
	@ApiProperty()
	@PrimaryGeneratedColumn('uuid')
	id: string;

	@ApiProperty()
	@Column()
	name: string;

	@ApiProperty({ required: false, nullable: true })
	@Column({ nullable: true })
	avatar: string;

	@ApiProperty({ enum: ParticipantType })
	@Column({
		type: 'enum',
		enum: ParticipantType,
		default: ParticipantType.GUEST,
	})
	type: ParticipantType;

	@ApiProperty({ default: 0 })
	@Column({ type: 'float', default: 0 })
	totalScore: number;

	@ApiProperty({ default: 0 })
	@Column({ type: 'int', default: 0 })
	totalTimeSpent: number;

	@ManyToOne(() => Session, (session) => session.participants, {
		onDelete: 'CASCADE',
	})
	session: Session;

	@ManyToOne(() => StudentProfile, (profile) => profile.quizParticipation, {
		nullable: true,
	})
	@JoinColumn({ name: 'studentProfileId' })
	studentProfile: StudentProfile | null;

	@OneToMany(() => SessionParticipantAnswer, (answer) => answer.participant)
	answers: SessionParticipantAnswer[];
}
