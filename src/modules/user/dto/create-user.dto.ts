import { ApiProperty } from '@nestjs/swagger';
import {
	IsEmail,
	IsNotEmpty,
	IsString,
	MinLength,
	MaxLength,
	IsEnum,
} from 'class-validator';
import { UserRolesEnum } from '../user.types';

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

	@ApiProperty({ enum: UserRolesEnum, example: UserRolesEnum.STUDENT })
	@IsEnum(UserRolesEnum)
	role: UserRolesEnum;

	@ApiProperty({ example: 'John' })
	@IsString()
	@IsNotEmpty()
	firstName: string;

	@ApiProperty({ example: 'Doe' })
	@IsString()
	@IsNotEmpty()
	lastName: string;
}
