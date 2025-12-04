import { ApiProperty } from '@nestjs/swagger';
import {
	IsEmail,
	IsOptional,
	IsString,
	MinLength,
	MaxLength,
	IsEnum,
} from 'class-validator';
import { Role } from '../enums/user.enums';

export class UpdateUserDto {
	@ApiProperty({ required: false })
	@IsEmail()
	@IsOptional()
	email?: string;

	@ApiProperty({ required: false })
	@IsString()
	@MinLength(3)
	@MaxLength(20)
	@IsOptional()
	username?: string;

	@ApiProperty({ required: false })
	@IsString()
	@MinLength(6)
	@MaxLength(50)
	@IsOptional()
	password?: string;

	@ApiProperty({ enum: Role, required: false })
	@IsEnum(Role)
	@IsOptional()
	role?: Role;

	@ApiProperty({ required: false })
	@IsString()
	@MinLength(3)
	@MaxLength(50)
	@IsOptional()
	firstName: string;

	@ApiProperty({ required: false })
	@IsString()
	@MinLength(3)
	@MaxLength(50)
	@IsOptional()
	lastName: string;

	@ApiProperty({ nullable: true })
	@IsString()
	@MinLength(6)
	@MaxLength(50)
	@IsOptional()
	avatar: string | null;
}
