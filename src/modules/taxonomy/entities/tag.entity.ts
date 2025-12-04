import { Entity, PrimaryGeneratedColumn, Column, ManyToMany } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { Quiz } from '../../quiz/entities/quiz.entity';

@Entity('tags')
export class Tag {
	@ApiProperty({ example: 'uuid-string' })
	@PrimaryGeneratedColumn('uuid')
	id: string;

	@ApiProperty({ example: 'Mathematics', description: 'Unique tag name' })
	@Column({ unique: true })
	name: string;

	@ApiProperty({ example: 'mathematics', description: 'URL-friendly slug' })
	@Column({ unique: true })
	slug: string;

	@ManyToMany(() => Quiz, (quiz) => quiz.tags)
	quizzes: Quiz[];
}
