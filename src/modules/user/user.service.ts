import { Injectable, Logger } from '@nestjs/common';
import { CreateUserDto, QueryUsersDto, UpdateUserDto } from './dto';
import { createPaginatedResponse, HashUtil } from '@common/utils';
import { FindOptionsWhere, ILike, Repository } from 'typeorm';
import { User } from './entities';
import { InjectRepository } from '@nestjs/typeorm';
import { PaginatedResult } from '@common/types';

@Injectable()
export class UserService {
	private readonly logger = new Logger(UserService.name);
	constructor(
		@InjectRepository(User)
		private readonly userRepository: Repository<User>,
		private readonly hashUtil: HashUtil,
	) {}

	async create(createUserDto: CreateUserDto): Promise<User> {
		const hashedPassword = await this.hashUtil.hash(createUserDto.password);
		const user = this.userRepository.create({
			...createUserDto,
			password: hashedPassword,
		});
		await this.userRepository.save(user);
		return user;
	}

	async getById(id: string): Promise<User> {
		this.logger.debug(
			`Looking for a user by id: ${id} with the following parameters`,
		);
		const user = await this.userRepository.findOneOrFail({
			where: { id },
		});
		return user;
	}
	async getAll(queryDto: QueryUsersDto): Promise<PaginatedResult<User>> {
		this.logger.debug('Finding users with the following parameters', {
			queryDto,
		});
		const { page, perPage, order, search } = queryDto;

		const take = perPage;
		const skip = (page - 1) * perPage;

		const where: FindOptionsWhere<User>[] | FindOptionsWhere<User> = search
			? [
					{ email: ILike(`%${search}%`) },
					{ username: ILike(`%${search}%`) },
				]
			: {};

		const [users, total] = await this.userRepository.findAndCount({
			where,
			order,
			take,
			skip,
		});

		return createPaginatedResponse(users, { total, perPage, page });
	}

	async update(id: string, updateUserDto: UpdateUserDto): Promise<User> {
		if (updateUserDto.password) {
			updateUserDto.password = await this.hashUtil.hash(
				updateUserDto.password,
			);
		}
		const user = this.userRepository.save({
			id,
			...updateUserDto,
		});
		return user;
	}

	async delete(id: string): Promise<User> {
		this.logger.debug('Deleting user by id', {
			id,
		});
		const userToRemove = await this.userRepository.findOneByOrFail({ id });
		const user = await this.userRepository.remove(userToRemove);
		return user;
	}
}
