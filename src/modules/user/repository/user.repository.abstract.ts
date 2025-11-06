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
}
