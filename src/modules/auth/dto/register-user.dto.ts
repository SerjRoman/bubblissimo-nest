import { Role } from '@modules/user/enums';
import { ApiProperty } from '@nestjs/swagger';
import {
	IsArray,
	IsEmail,
	IsNotEmpty,
	IsString,
	MaxLength,
	MinLength,
} from 'class-validator';

export class RegisterUserDto {
	@ApiProperty({ example: 'test@example.com' })
	@IsEmail()
	@IsNotEmpty()
	email: string;

	@ApiProperty({ example: 'johndoe' })
	@IsString()
	@MinLength(3)
	@MaxLength(20)
	username: string;

	@ApiProperty({ example: 'strongpassword123' })
	@IsString()
	@MinLength(6)
	@MaxLength(50)
	password: string;

	@ApiProperty({ example: 'John' })
	@IsString()
	@IsNotEmpty()
	firstName: string;

	@ApiProperty({ example: 'Doe' })
	@IsString()
	@IsNotEmpty()
	lastName: string;

	@ApiProperty({
		type: 'array',
		enum: Role,
		example: Role.STUDENT,
	})
	@IsArray()
	roles: Role[];
}
