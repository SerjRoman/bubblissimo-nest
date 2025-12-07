import {
	IsEnum,
	IsNotEmpty,
	IsString,
	IsUUID,
	NotEquals,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { QuizAccessParamDto } from './quiz-access-param.dto';
import { QuizAccessType } from '../enums';

export class QuizAccessUpdateDto {
	@ApiProperty({
		enum: QuizAccessType,
		required: true,
		enumName: 'Quiz access type',
		description:
			'Type of the access to update for the access. Excluding OWNER',
		default: QuizAccessType.VIEWER,
	})
	@IsEnum(QuizAccessType)
	@NotEquals(QuizAccessType.OWNER)
	accessType: Exclude<QuizAccessType, QuizAccessType.OWNER>;
}

export class QuizAccessUpdateParamDto extends QuizAccessParamDto {
	@ApiProperty({
		type: 'string',
		required: true,
		description: 'ID of the access to update',
	})
	@IsString()
	@IsNotEmpty()
	@IsUUID('4')
	accessId: string;
}
