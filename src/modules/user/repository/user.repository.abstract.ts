import { PaginatedResult, PaginationParams } from '@common/types';
import {
	UserCreateInput,
	UserInclude,
	UserOmit,
	UserSelect,
	UserSortOptions,
	UserUpdateInput,
	UserWhereInput,
	UserWhereUnique,
	UserWithArgs,
	UserWithoutPassword,
	UserWithSelect,
} from '../user.types';

export abstract class UserContractRepository {
	abstract create(data: UserCreateInput): Promise<UserWithoutPassword>;
	abstract update(
		where: UserWhereUnique,
		data: UserUpdateInput,
	): Promise<UserWithoutPassword>;
	abstract delete(where: UserWhereUnique): Promise<UserWithoutPassword>;
	abstract getWithSelect<S extends UserSelect>({
		where,
		select,
	}: {
		where: UserWhereUnique;
		select?: S;
	}): Promise<UserWithSelect<S>>;
	abstract get<I extends UserInclude, O extends UserOmit>({
		where,
		include,
		omit,
	}: {
		where: UserWhereUnique;
		include?: I;
		omit?: O;
	}): Promise<UserWithArgs<I, O>>;
	abstract getAll<I extends UserInclude, O extends UserOmit>({
		where,
		pagination,
		include,
		omit,
		orderBy,
	}: {
		where?: UserWhereInput;
		include?: I;
		omit?: O;
		pagination: PaginationParams;
		orderBy?: UserSortOptions;
	}): Promise<PaginatedResult<UserWithArgs<I, O>>>;
	abstract getAllWithSelect<S extends UserSelect>({
		where,
		pagination,
		select,
		orderBy,
	}: {
		where?: UserWhereInput;
		pagination: PaginationParams;
		select?: S;
		orderBy?: UserSortOptions;
	}): Promise<PaginatedResult<UserWithSelect<S>>>;
}
