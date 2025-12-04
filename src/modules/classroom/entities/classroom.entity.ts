import {
	Entity,
	PrimaryGeneratedColumn,
	Column,
	OneToMany,
	CreateDateColumn,
	UpdateDateColumn,
} from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { Report } from '@modules/report/entities';
import { ClassroomStudent } from './classroom-student.entity';
import { ClassroomTeacher } from './classroom-teacher.entity';

@Entity('classrooms')
export class Classroom {
	@ApiProperty()
	@PrimaryGeneratedColumn('uuid')
	id: string;

	@ApiProperty()
	@Column()
	name: string;

	@ApiProperty({ type: () => [ClassroomTeacher] })
	@OneToMany(() => ClassroomTeacher, (ct) => ct.classroom, { cascade: true })
	teachers: ClassroomTeacher[];

	@OneToMany(() => ClassroomStudent, (cs) => cs.classroom)
	students: ClassroomStudent[];

	@OneToMany(() => Report, (report) => report.classroom)
	report: Report[];

	@CreateDateColumn()
	createdAt: Date;

	@UpdateDateColumn()
	updatedAt: Date;
}
