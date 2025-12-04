import {
	Entity,
	PrimaryGeneratedColumn,
	ManyToOne,
	CreateDateColumn,
	UpdateDateColumn,
} from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { Classroom } from '../../classroom/entities/classroom.entity';
import { Session } from '../../session/entities/session.entity';

@Entity('reports')
export class Report {
	@ApiProperty()
	@PrimaryGeneratedColumn('uuid')
	id: string;

	@ManyToOne(() => Classroom, (classroom) => classroom.report, {
		onDelete: 'CASCADE',
	})
	classroom: Classroom;

	@ManyToOne(() => Session, (session) => session.reports, {
		onDelete: 'CASCADE',
	})
	session: Session;

	@CreateDateColumn()
	createdAt: Date;

	@UpdateDateColumn()
	updatedAt: Date;
}
