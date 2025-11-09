import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import type {
	DynamicUserResult,
	UserWhereInput,
	UserWithoutPassword,
} from './user.types';
import { UserContractRepository } from './repository/user.repository.abstract';
import { QueryUserDto } from './dto';
import { QueryUsersDto } from './dto/query-users.dto';
import { PaginatedResult } from '@common/types';
import { HashUtil } from '@common/utils';

@Injectable()
export class UserService {
	constructor(
		private readonly userRepository: UserContractRepository,
		private readonly hashUtil: HashUtil,
	) {}

	async create(createUserDto: CreateUserDto): Promise<UserWithoutPassword> {
		const hashedPassword = await this.hashUtil.hash(createUserDto.password);
		const user = await this.userRepository.create({
			...createUserDto,
			password: hashedPassword,
		});

		return user;
	}

	async getById<Q extends QueryUserDto>(
		id: string,
		queryDto?: Q,
	): Promise<DynamicUserResult<Q>> {
		if (queryDto?.select) {
			const user = await this.userRepository.getWithSelect({
				where: { id },
				...queryDto,
			});
			return user as DynamicUserResult<Q>;
		}

		const user = await this.userRepository.get({
			where: { id },
			...queryDto,
		});
		return user as unknown as DynamicUserResult<Q>;
	}
	async getAll<Q extends QueryUsersDto>(
		queryDto: QueryUsersDto,
	): Promise<PaginatedResult<DynamicUserResult<Q>>> {
		const pagination = {
			perPage: queryDto.perPage,
			page: queryDto.page,
		};
		const where: UserWhereInput = queryDto.search
			? {
					OR: [
						{
							username: {
								contains: queryDto.search,
								mode: 'insensitive',
							},
						},
						{
							email: {
								contains: queryDto.search,
								mode: 'insensitive',
							},
						},
					],
				}
			: {};
		if (queryDto?.select) {
			const users = await this.userRepository.getAllWithSelect({
				where,
				pagination,
				...queryDto,
			});
			return users as unknown as PaginatedResult<DynamicUserResult<Q>>;
		}

		const user = await this.userRepository.getAll({
			where,
			pagination,
			...queryDto,
		});
		return user as unknown as PaginatedResult<DynamicUserResult<Q>>;
	}

	async update(
		id: string,
		updateUserDto: UpdateUserDto,
	): Promise<UserWithoutPassword> {
		if (updateUserDto.password) {
			updateUserDto.password = await this.hashUtil.hash(
				updateUserDto.password,
			);
		}
		const user = await this.userRepository.update({ id }, updateUserDto);
		return user;
	}

	async delete(id: string): Promise<UserWithoutPassword> {
		const user = await this.userRepository.delete({ id });
		return user;
	}
}
