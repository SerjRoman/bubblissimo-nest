import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class RefreshDto {
	@ApiProperty({
		example: 'refresh_token',
		description: 'You must provide refresh token to get a new JWT token',
	})
	@IsNotEmpty()
	@IsString()
	refreshToken: string;
}
