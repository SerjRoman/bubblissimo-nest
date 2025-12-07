import { IsString, IsUUID } from 'class-validator';

export class QuizParamDto {
	@IsString()
	@IsUUID('4')
	id: string;
}
