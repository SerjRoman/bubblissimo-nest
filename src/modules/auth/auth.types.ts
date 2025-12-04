import { User } from '@modules/user/entities';

export type TokenResponse = { accessToken: string; refreshToken: string };
export type AuthenticatedUserResponse = Pick<
	User,
	'id' | 'firstName' | 'avatar' | 'lastName' | 'roles' | 'email'
>;
