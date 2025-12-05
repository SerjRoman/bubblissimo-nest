import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsUUID, IsNotEmpty } from 'class-validator';

export class QuizCopyDto {
	@ApiProperty({
		description: 'The UUID of the Quiz to toggle favourites',
		example: 'a1b2c3d4-e5f6-7890-1234-567890abcdef',
	})
	@IsString()
	@IsUUID('4')
	@IsNotEmpty()
	quizId: string;
}
