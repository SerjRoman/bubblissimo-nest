import { UserWithSelect } from '@modules/user/user.types';

export type TokenResponse = { accessToken: string; refreshToken: string };
export type AuthenticatedUserResponse = UserWithSelect<{
	id: true;
	firstName: true;
	lastName: true;
	avatar: true;
	email: true;
	username: true;
	roles: true;
}>;
