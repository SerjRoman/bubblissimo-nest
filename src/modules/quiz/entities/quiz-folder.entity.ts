import {
	Entity,
	PrimaryGeneratedColumn,
	Column,
	ManyToOne,
	OneToMany,
	ManyToMany,
	JoinTable,
	CreateDateColumn,
	UpdateDateColumn,
} from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { Quiz } from './quiz.entity';
import { TeacherProfile } from '@modules/user/entities';

@Entity('quiz_folders')
export class QuizFolder {
	@ApiProperty()
	@PrimaryGeneratedColumn('uuid')
	id: string;

	@ApiProperty()
	@Column()
	name: string;

	@ApiProperty()
	@Column()
	slug: string;

	@ApiProperty({ example: '#FF0000' })
	@Column()
	color: string;

	@ApiProperty({ description: 'Parent folder ID', required: false })
	@ManyToOne(() => QuizFolder, (folder) => folder.subFolders, {
		nullable: true,
	})
	parentFolder: QuizFolder;

	@OneToMany(() => QuizFolder, (folder) => folder.parentFolder)
	subFolders: QuizFolder[];

	@ManyToOne(() => TeacherProfile, (profile) => profile.quizFolders, {
		onDelete: 'CASCADE',
	})
	owner: TeacherProfile;

	@ApiProperty({ type: () => [Quiz] })
	@ManyToMany(() => Quiz, (quiz) => quiz.folders)
	@JoinTable({ name: 'quiz_folders_quizzes' })
	quizzes: Quiz[];

	@CreateDateColumn()
	createdAt: Date;

	@UpdateDateColumn()
	updatedAt: Date;
}
