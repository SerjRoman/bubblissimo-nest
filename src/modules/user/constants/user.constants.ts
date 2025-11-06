import { IncludeValidationRule } from '@common/types/allowed-fields.types';

export const USER_PUBLIC_FIELDS = [
	'avatar',
	'createdAt',
	'id',
	'username',
	'email',
	'firstName',
	'lastName',
	'role',
	'favouriteQuzzesIds',
	'updatedAt',
	'favourite',
	'teacherProfile',
	'studentProfile',
	'notifications',
	'_count',
];

export const USER_INCLUDE_RULES: IncludeValidationRule = {
	relations: ['teacherProfile', 'studentProfile', 'notifications', '_count'],
};
