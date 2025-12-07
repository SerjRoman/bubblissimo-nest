import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsUUID } from 'class-validator';
import { QuizAccessParamDto } from './quiz-access-param.dto';

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
