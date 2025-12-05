import { FindOptionsOrder } from 'typeorm';
import { User } from './entities';

export const USER_ORDER_FIELDS: (keyof FindOptionsOrder<User>)[] = [
	'createdAt',
	'firstName',
	'lastName',
	'username',
	'email',
];
