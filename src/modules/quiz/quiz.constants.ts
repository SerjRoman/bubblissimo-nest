import { FindOptionsOrder } from 'typeorm';
import { Quiz } from './entities';

export const QUIZ_ORDER_FIELDS: (keyof FindOptionsOrder<Quiz>)[] = [
	'id',
	'title',
	'createdAt',
];
