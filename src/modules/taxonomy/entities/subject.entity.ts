import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { Quiz } from '../../quiz/entities/quiz.entity';

@Entity('subjects')
export class Subject {
	@ApiProperty({ example: 'uuid-string' })
	@PrimaryGeneratedColumn('uuid')
	id: string;

	@ApiProperty({ example: 'History', description: 'Unique subject name' })
	@Column({ unique: true })
	name: string;

	@ApiProperty({ example: 'history', description: 'URL-friendly slug' })
	@Column({ unique: true })
	slug: string;

	@OneToMany(() => Quiz, (quiz) => quiz.subject)
	quizzes: Quiz[];
}
