import { Entity, PrimaryGeneratedColumn, Column, ManyToMany } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { Quiz } from '../../quiz/entities/quiz.entity';

@Entity('languages')
export class Language {
	@ApiProperty({ example: 'uuid-string' })
	@PrimaryGeneratedColumn('uuid')
	id: string;

	@ApiProperty({ example: 'English', description: 'Unique language name' })
	@Column({ unique: true })
	name: string;

	@ApiProperty({ example: 'en', description: 'URL-friendly slug' })
	@Column({ unique: true })
	slug: string;

	@ManyToMany(() => Quiz, (quiz) => quiz.languages)
	quizzes: Quiz[];
}
