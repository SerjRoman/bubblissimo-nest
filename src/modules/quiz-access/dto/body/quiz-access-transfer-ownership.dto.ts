import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsUUID } from 'class-validator';

export class QuizAccessTransferOwnershipDto {
	@ApiProperty({
		type: 'string',
		required: true,
		description: 'ID of the teacher to transfer ownership',
	})
	@IsString()
	@IsNotEmpty()
	@IsUUID('4')
	teacherId: string;

	@ApiProperty({
		type: 'string',
		required: true,
		description: 'ID of the access to give owner',
	})
	@IsString()
	@IsNotEmpty()
	@IsUUID('4')
	accessId: string;
}
