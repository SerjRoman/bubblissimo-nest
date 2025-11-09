import {
	ConflictException,
	Injectable,
	NotFoundException,
} from '@nestjs/common';
import { UserContractRepository } from './user.repository.abstract';
import {
	UserCreateInput,
	UserInclude,
	UserOmit,
	UserSelect,
	UserUpdateInput,
	UserWhereInput,
	UserWhereUnique,
	UserWithArgs,
	UserWithoutPassword,
	UserWithSelect,
} from '../user.types';
import { PaginationParams, PaginatedResult } from '@common/types';

@Injectable()
export class InMemoryUserRepository implements UserContractRepository {
	users: UserWithoutPassword[] = [];
	idCounter = 1;

	public clear(): void {
		this.users = [];
		this.idCounter = 1;
	}

	async create(data: UserCreateInput): Promise<UserWithoutPassword> {
		const existingUser = this.users.find(
			(user) => user.email === data.email,
		);
		if (existingUser) {
			throw new ConflictException('User with this email already exists');
		}

		const newUser: UserWithoutPassword = {
			...data,
			id: `user-${this.idCounter++}`,
			email: data.email,
			createdAt: new Date(),
			updatedAt: new Date(),
			avatar: data.avatar || null,
			roles: Array.isArray(data.roles) ? data.roles : [],
			favouriteQuzzesIds: Array.isArray(data.favouriteQuzzesIds)
				? data.favouriteQuzzesIds
				: [],
		};

		this.users.push(newUser);
		return JSON.parse(JSON.stringify(newUser));
	}

	async get<I extends UserInclude, O extends UserOmit>(params: {
		where: UserWhereUnique;
		include?: I;
		omit?: O;
	}): Promise<UserWithArgs<I, O>> {
		const { where } = params;
		const user = this.users.find(
			(u) => u.id === where.id || u.email === where.email,
		);

		if (!user) {
			throw new NotFoundException('User not found');
		}

		return JSON.parse(JSON.stringify(user));
	}

	async getWithSelect<S extends UserSelect>(params: {
		where: UserWhereUnique;
		select?: S;
	}): Promise<UserWithSelect<S>> {
		const { where } = params;
		const user = this.users.find(
			(u) => u.id === where.id || u.email === where.email,
		);

		if (!user) {
			throw new NotFoundException('User not found');
		}

		return JSON.parse(JSON.stringify(user));
	}

	async update(
		where: UserWhereUnique,
		data: UserUpdateInput,
	): Promise<UserWithoutPassword> {
		const userIndex = this.users.findIndex((u) => u.id === where.id);

		if (userIndex === -1) {
			throw new NotFoundException('User not found');
		}

		this.users[userIndex] = {
			...this.users[userIndex],
			...(data as Partial<UserWithoutPassword>),
			updatedAt: new Date(),
		};

		return JSON.parse(JSON.stringify(this.users[userIndex]));
	}

	async delete(where: UserWhereUnique): Promise<UserWithoutPassword> {
		const userIndex = this.users.findIndex((u) => u.id === where.id);

		if (userIndex === -1) {
			throw new NotFoundException('User not found');
		}

		const [deletedUser] = this.users.splice(userIndex, 1);
		return deletedUser;
	}
	async getAll<I extends UserInclude, O extends UserOmit>({
		pagination,
	}: {
		where?: UserWhereInput;
		include?: I;
		omit?: O;
		pagination: PaginationParams;
	}): Promise<PaginatedResult<UserWithArgs<I, O>>> {
		const { page, perPage } = pagination;
		const total = this.users.length;
		const pageCount = Math.ceil(total / perPage);
		const skip = (page - 1) * perPage;

		const paginatedUsers = this.users.slice(skip, skip + perPage);
		return [
			paginatedUsers as unknown as UserWithArgs<I, O>[],
			{
				total,
				page,
				perPage,
				pageCount,
			},
		];
	}

	async getAllWithSelect<S extends UserSelect>({
		where,
		pagination,
	}: {
		where?: UserWhereInput;
		pagination: PaginationParams;
		select?: S;
	}): Promise<PaginatedResult<UserWithSelect<S>>> {
		const filteredUsers = this.users.filter((user) => {
			if (!where) return true;
			return Object.keys(where).every((key) => user[key] === where[key]);
		});

		const { page, perPage } = pagination;
		const total = filteredUsers.length;
		const pageCount = Math.ceil(total / perPage);
		const skip = (page - 1) * perPage;

		const paginatedUsers = filteredUsers.slice(skip, skip + perPage);

		return [
			paginatedUsers as UserWithSelect<S>[],
			{
				total,
				page,
				perPage,
				pageCount,
			},
		];
	}
}
