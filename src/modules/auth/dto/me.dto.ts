import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class MeDto {
	@ApiProperty({
		example: 'user-id-123',
		description:
			'Get user data based on user ID and authentication. You must have JWT token to access endpoint',
	})
	@IsString()
	userId: string;
}
