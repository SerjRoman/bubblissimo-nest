import {
	Entity,
	PrimaryGeneratedColumn,
	ManyToOne,
	CreateDateColumn,
	UpdateDateColumn,
} from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { Classroom } from './classroom.entity';
import { StudentProfile } from '@modules/user/entities';

@Entity('classroom_students')
export class ClassroomStudent {
	@ApiProperty()
	@PrimaryGeneratedColumn('uuid')
	id: string;

	@ManyToOne(() => Classroom, (c) => c.students, { onDelete: 'CASCADE' })
	classroom: Classroom;

	@ManyToOne(() => StudentProfile, (s) => s.classroomMemberships, {
		onDelete: 'CASCADE',
	})
	student: StudentProfile;

	@CreateDateColumn()
	createdAt: Date;

	@UpdateDateColumn()
	updatedAt: Date;
}
