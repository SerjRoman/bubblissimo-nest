import { ApiProperty } from '@nestjs/swagger';
import {
	IsEmail,
	IsNotEmpty,
	IsString,
	MinLength,
	MaxLength,
	IsArray,
} from 'class-validator';
import { Role } from '../enums/user.enums';

export class CreateUserDto {
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

	@ApiProperty({ isArray: true })
	@IsArray()
	roles: Role[];

	@ApiProperty({ example: 'John' })
	@IsString()
	@IsNotEmpty()
	firstName: string;

	@ApiProperty({ example: 'Doe' })
	@IsString()
	@IsNotEmpty()
	lastName: string;
}
