import {
	Entity,
	PrimaryGeneratedColumn,
	Column,
	ManyToOne,
	CreateDateColumn,
	UpdateDateColumn,
} from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { NotificationType } from '../enums/notification-type.enum';
import { User } from '@modules/user/entities';

@Entity('notifications')
export class Notification {
	@ApiProperty()
	@PrimaryGeneratedColumn('uuid')
	id: string;

	@ApiProperty({ enum: NotificationType })
	@Column({
		type: 'enum',
		enum: NotificationType,
		default: NotificationType.INFO,
	})
	type: NotificationType;

	@ApiProperty()
	@Column()
	content: string;

	@ApiProperty()
	@Column({ default: false })
	read: boolean;

	@ManyToOne(() => User, (user) => user.notifications, {
		onDelete: 'CASCADE',
	})
	user: User;

	@ApiProperty()
	@CreateDateColumn()
	createdAt: Date;

	@ApiProperty()
	@UpdateDateColumn()
	updatedAt: Date;
}
