import {
	Entity,
	PrimaryGeneratedColumn,
	Column,
	ManyToOne,
	Unique,
	CreateDateColumn,
	UpdateDateColumn,
} from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { Classroom } from './classroom.entity';
import { TeacherProfile } from '../../user/entities/teacher-profile.entity';
import { ClassroomRole } from '../enums/classroom-role.enum';

@Entity('classroom_teachers')
@Unique(['classroom', 'teacher'])
export class ClassroomTeacher {
	@ApiProperty()
	@PrimaryGeneratedColumn('uuid')
	id: string;

	@ApiProperty({ enum: ClassroomRole })
	@Column({
		type: 'enum',
		enum: ClassroomRole,
		default: ClassroomRole.VIEWER,
	})
	role: ClassroomRole;

	@ManyToOne(() => Classroom, (classroom) => classroom.teachers, {
		onDelete: 'CASCADE',
	})
	classroom: Classroom;

	@ManyToOne(
		() => TeacherProfile,
		(profile) => profile.classroomMemberships,
		{ onDelete: 'CASCADE' },
	)
	teacher: TeacherProfile;

	@CreateDateColumn()
	createdAt: Date;

	@UpdateDateColumn()
	updatedAt: Date;
}
