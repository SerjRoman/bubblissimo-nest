import {
	Entity,
	PrimaryGeneratedColumn,
	Column,
	CreateDateColumn,
	UpdateDateColumn,
	OneToOne,
	OneToMany,
	ManyToMany,
	JoinTable,
} from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';

import { TeacherProfile } from './teacher-profile.entity';
import { StudentProfile } from './student-profile.entity';
import { Role } from '../enums/user.enums';
import { Notification } from '@modules/notification/entities';
import { Quiz } from '@modules/quiz/entities';

@Entity('users')
export class User {
	@ApiProperty({
		example: '123e4567-e89b-12d3-a456-426614174000',
		description: 'Unique UUID',
	})
	@PrimaryGeneratedColumn('uuid')
	id: string;

	@ApiProperty({ example: 'johndoe', description: 'Unique username' })
	@Column({ unique: true })
	username: string;

	@ApiProperty({ example: 'john@example.com', description: 'Unique email' })
	@Column({ unique: true })
	email: string;

	@ApiProperty({ description: 'Hashed password', writeOnly: true })
	@Column({ select: false })
	password: string;

	@ApiProperty({ example: 'John' })
	@Column()
	firstName: string;

	@ApiProperty({ example: 'Doe' })
	@Column()
	lastName: string;

	@ApiProperty({ enum: Role, isArray: true, example: [Role.STUDENT] })
	@Column({
		type: 'enum',
		enum: Role,
		array: true,
		default: [Role.STUDENT],
	})
	roles: Role[];

	@ApiProperty({
		example: 'https://example.com/avatar.jpg',
		required: false,
		nullable: true,
	})
	@Column({ nullable: true , type: "text"})
	avatar: string | null;

	@ApiProperty({ type: () => TeacherProfile, required: false })
	@OneToOne(() => TeacherProfile, (profile) => profile.user, {
		cascade: true,
	})
	teacherProfile: TeacherProfile;

	@ApiProperty({ type: () => StudentProfile, required: false })
	@OneToOne(() => StudentProfile, (profile) => profile.user, {
		cascade: true,
	})
	studentProfile: StudentProfile;

	@ApiProperty({
		type: () => [Quiz],
		description: 'Quizzes marked as favourite',
	})
	@ManyToMany(() => Quiz)
	@JoinTable({ name: 'users_favourite_quizzes' })
	favouriteQuizzes: Quiz[];

	@OneToMany(() => Notification, (notification) => notification.user)
	notifications: Notification[];

	@ApiProperty()
	@CreateDateColumn()
	createdAt: Date;

	@ApiProperty()
	@UpdateDateColumn()
	updatedAt: Date;
}
