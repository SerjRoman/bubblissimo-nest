import {
	IsEnum,
	IsNotEmpty,
	IsString,
	IsUUID,
	NotEquals,
} from 'class-validator';
import { QuizAccessType } from '../enums';
import { ApiProperty } from '@nestjs/swagger';

export class QuizAccessCreateDto {
	@ApiProperty({
		type: 'string',
		required: true,
		description: 'ID of the teacher to grant access to the quiz',
	})
	@IsString()
	@IsNotEmpty()
	@IsUUID('4')
	teacherId: string;

	@ApiProperty({
		enum: QuizAccessType,
		required: true,
		enumName: 'Quiz access type',
		description:
			'Type of the access to give to the teacher. Excluding OWNER',
		default: QuizAccessType.VIEWER,
	})
	@IsEnum(QuizAccessType)
	@NotEquals(QuizAccessType.OWNER)
	accessType: Exclude<QuizAccessType, QuizAccessType.OWNER>;
}
