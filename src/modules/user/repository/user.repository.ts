import { PrismaErrorCodes } from '@common/types/prisma.types';
import { handlePrismaError } from '@common/utils/prisma-error.handler';
import {
	ConflictException,
	Injectable,
	NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '@prisma';
import {
	UserCreateInput,
	UserInclude,
	UserOmit,
	UserSelect,
	UserUpdateInput,
	UserWhereUnique,
	UserWithArgs,
	UserWithoutPassword,
	UserWithSelect,
} from '../user.types';
import { UserContractRepository } from './user.repository.abstract';

@Injectable()
export class UserRepository implements UserContractRepository {
	constructor(private readonly prisma: PrismaService) {}

	async create(data: UserCreateInput): Promise<UserWithoutPassword> {
		return handlePrismaError(this.prisma.client.user.create({ data }), {
			[PrismaErrorCodes.CONFLICT]: new ConflictException('User'),
		});
	}
	async update(
		where: UserWhereUnique,
		data: UserUpdateInput,
	): Promise<UserWithoutPassword> {
		const userPromise = this.prisma.client.user.update({
			where,
			data,
		});
		return handlePrismaError(userPromise, {
			[PrismaErrorCodes.NOT_FOUND]: new NotFoundException('User'),
		});
	}
	async delete(where: UserWhereUnique): Promise<UserWithoutPassword> {
		const userPromise = this.prisma.client.user.delete({
			where,
		});
		return handlePrismaError(userPromise, {
			[PrismaErrorCodes.NOT_FOUND]: new NotFoundException('User'),
		});
	}
	async getWithSelect<S extends UserSelect>({
		where,
		select,
	}: {
		where: UserWhereUnique;
		select?: S;
	}): Promise<UserWithSelect<S>> {
		const userPromise = this.prisma.client.user.findUniqueOrThrow({
			where,
			select,
		}) as Promise<UserWithSelect<S>>;

		return handlePrismaError(userPromise, {
			[PrismaErrorCodes.NOT_FOUND]: new NotFoundException('User'),
		});
	}

	async get<I extends UserInclude, O extends UserOmit>({
		where,
		include,
		omit,
	}: {
		where: UserWhereUnique;
		include?: I;
		omit?: O;
	}): Promise<UserWithArgs<I, O>> {
		const userPromise = this.prisma.client.user.findUniqueOrThrow({
			where,
			include,
			omit,
		}) as unknown as Promise<UserWithArgs<I, O>>;

		return handlePrismaError(userPromise, {
			[PrismaErrorCodes.NOT_FOUND]: new NotFoundException('User'),
		});
	}
}
