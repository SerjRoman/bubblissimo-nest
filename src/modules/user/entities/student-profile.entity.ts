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
import { Quiz } from '@modules/quiz/entities';
import { ClassroomStudent } from '@modules/classroom/entities';
import { SessionParticipant } from '@modules/session/entities';

@Entity('student_profiles')
export class StudentProfile {
	@ApiProperty({ example: 'uuid-string' })
	@PrimaryGeneratedColumn('uuid')
	id: string;

	@OneToOne(() => User, (user) => user.studentProfile, {
		onDelete: 'CASCADE',
	})
	@JoinColumn({ name: 'userId' })
	user: User;

	@ApiProperty({ description: 'Quizzes completed by the student' })
	@ManyToMany(() => Quiz)
	@JoinTable({ name: 'student_completed_quizzes' })
	completedQuizzes: Quiz[];

	@OneToMany(() => ClassroomStudent, (member) => member.student)
	classroomMemberships: ClassroomStudent[];

	@OneToMany(
		() => SessionParticipant,
		(participant) => participant.studentProfile,
	)
	quizParticipation: SessionParticipant[];
}
