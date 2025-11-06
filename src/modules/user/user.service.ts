import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import type { UserInclude, UserWithoutPassword } from './user.types';
import { hash } from 'bcryptjs';
import { UserContractRepository } from './repository/user.repository.abstract';

@Injectable()
export class UserService {
	constructor(private readonly userRepository: UserContractRepository) {}

	async create(createUserDto: CreateUserDto): Promise<UserWithoutPassword> {
		const hashedPassword = await hash(createUserDto.password, 10);

		const user = await this.userRepository.create({
			...createUserDto,
			password: hashedPassword,
		});

		return user;
	}

	async findById(
		id: string,
		includeFields?: UserInclude,
	): Promise<UserWithoutPassword> {
		const user = await this.userRepository.get({
			where: {
				id,
			},
			include: includeFields,
		});
		return user;
	}

	async update(
		id: string,
		updateUserDto: UpdateUserDto,
	): Promise<UserWithoutPassword> {
		if (updateUserDto.password) {
			updateUserDto.password = await hash(updateUserDto.password, 10);
		}
		const user = await this.userRepository.update({ id }, updateUserDto);
		return user;
	}

	async delete(id: string): Promise<UserWithoutPassword> {
		const user = await this.userRepository.delete({ id });
		return user;
	}
}
