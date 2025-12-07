import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsUUID } from 'class-validator';

export class QuestionGetByQuizParamDto {
	@ApiProperty({
		type: 'string',
		required: true,
		description: 'ID of the quiz to delete access to',
	})
	@IsString()
	@IsNotEmpty()
	@IsUUID('4')
	quizId: string;
}
